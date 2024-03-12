import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Artwork } from "~/xata";

export const artworkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.custom<Omit<Artwork, "artist" | "id">>())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.artwork.create({
        ...input,
        artist: ctx.session.user,
      })
    }),
  update: protectedProcedure
    .input(z.custom<Partial<Omit<Artwork, "artist" | "id">> & { id: string }>())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.artwork.update({
        ...input,
      })
    }),
  all: publicProcedure
    .input(z.object({ limit: z.number().nullish() }).default({}))
    .query(({ ctx, input: { limit } }) => {
      if (!limit) return ctx.db.artwork
        .select(["name", "price", "style", "artist.*", "image.url"])
        .getAll()

      return ctx.db.artwork
        .select(["name", "price", "style", "size", "artist.*", "image.url"])
        .getMany({
          pagination: {
            size: limit ?? undefined,
          },
        });
    }),
  my: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.artwork
        .select(["name", "price", "style", "size", "artist.*", "image.url"])
        .filter({ "artist.id": ctx.session.user.id }).getAll();
    }),
  search: publicProcedure
    .input(z.string().nullish())
    .query(async ({ ctx, input }) => {
      const all = () => ctx.db.artwork.getAll();
      let result: Awaited<ReturnType<typeof all>>
      if (!input) {
        result = await all();
      } else {
        const search = await ctx.db.artwork.search(input, {
          target: [
            "size", "price", "style", "name",
          ],
          fuzziness: 2,
        }).then(c => c.records)
        if (search.length == 0) result = await all();
        // @ts-expect-error xxx
        else result = search
      }
      const wishlists = !ctx.session ? [] : await ctx.db.wishlist.filter({ "user.id": ctx.session.user.id }).getAll()
      return result.map(r => ({ ...r, isInWishlist: wishlists.some(w => w?.artwork?.id === r.id), artwork: '' }))
    }),
  searchWishlist: protectedProcedure
    .input(z.string().nullish())
    .query(async ({ ctx, input }) => {
      const all = () => ctx.db.wishlist.select(["artwork.*", "user.*"]).filter({ "user.id": ctx.session.user.id }).getAll();
      let result: Awaited<ReturnType<typeof all>>
      if (!input) {
        result = await all();
      } else {
        const artworkSearch = await ctx.db.artwork.search(input, {
          target: [
            "size", "price", "style", "name"
          ],
          fuzziness: 2,
        })
        const wishlist = await ctx.db.wishlist.select(["artwork.*"]).filter({
          "user.id": ctx.session.user.id,
        }).getAll();
        const search = wishlist.filter(l => artworkSearch.records.map(r => r.id).includes(l.artwork?.id ?? ''))
        if (search.length == 0) result = await all();
        // @ts-expect-error xxx
        else result = search
      }
      return result.filter(r => r.artwork && r.user?.id === ctx.session.user.id).map(r => r.artwork!)
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
