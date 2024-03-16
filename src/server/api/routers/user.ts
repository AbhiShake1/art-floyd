import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  updateBio: protectedProcedure
    .input(z.string().min(5))
    .mutation(({ ctx, input: bio }) => {
      return ctx.db.nextauth_users.update(ctx.session.user.id, { bio })
    }),
  withId: publicProcedure
    .input(z.string().min(1))
    .query(({ ctx, input: id }) => {
      return ctx.db.nextauth_users.read(id)
    }),
})
