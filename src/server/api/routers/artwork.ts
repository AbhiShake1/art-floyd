import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const artworkRouter = createTRPCRouter({
  all: publicProcedure.input(z.object({ limit: z.number().nullish() }).default({}))
    .query(({ ctx, input: { limit } }) => {
      if (!limit) return ctx.db.artwork.getAll()

      return ctx.db.artwork
        .select(["name", "price", "style", "size", "artist.*", "image.url"])
        .getMany({
          pagination: {
            size: limit ?? undefined,
          },
        });
    }),
  search: publicProcedure
    .input(z.string().nullish())
    .query(async ({ ctx, input }) => {
      if (!input) {
        return ctx.db.artwork.getAll();
      }
      return ctx.db.artwork.search(input, {
        target: [
          "size", "price", "style",
        ],
        fuzziness: 2,
      }).then(c => c.records)
    }),
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //
  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //       createdById: ctx.session.user.id,
  //     });
  //   }),
});
