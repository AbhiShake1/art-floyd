import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  updateBio: protectedProcedure
    .input(z.string().min(5))
    .mutation(({ ctx, input: bio }) => {
      return ctx.db.nextauth_users.update(ctx.session.user.id, { bio })
    }),
})
