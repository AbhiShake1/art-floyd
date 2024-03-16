import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type Chat } from "~/xata";

export const forumRouter = createTRPCRouter({
  all: protectedProcedure
    .query(({ ctx }) => ctx.db.chat.sort("xata.createdAt", "desc").select(["*", "owner.*"]).filter({ type: "forum" }).getAll()),
  create: protectedProcedure
    .input(z.custom<Pick<Chat, "title" | "description">>())
    .mutation(({ ctx, input: { title, description } }) => {
      return ctx.db.chat.create({
        type: "forum",
        title,
        description,
        owner: ctx.session.user.id,
      })
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: id }) => ctx.db.chat.delete({ id })),
  deleteReply: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: id }) => ctx.db.chatMessage.delete({ id })),
  byId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const replies = await ctx.db.chatMessage
        .select(["*", "sender.*"])
        .sort("xata.createdAt", "desc")
        .filter({ "chat.id": id }).getAll()
      const chat = await ctx.db.chat.filter({ id }).select(["*", "owner.*"]).getFirstOrThrow()
      return {
        ...chat,
        replies,
      }
    }),
  reply: protectedProcedure
    .input(z.object({ chatId: z.string(), message: z.string() }))
    .mutation(({ ctx, input: { chatId, message } }) => {
      return ctx.db.chatMessage.create({
        chat: chatId,
        message,
        sender: ctx.session.user.id,
      })
    }),
})
