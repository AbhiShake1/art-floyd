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
  addToWishlist: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: artworkId }) => {
      const artwork = await ctx.db.artwork.readOrThrow(artworkId)
      return ctx.db.wishlist.create({ artwork, user: ctx.session.user.id })
    }),
  removeFromWishlist: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: artworkId }) => {
      const wishlists = await ctx.db.wishlist.filter({ "artwork.id": artworkId, "user.id": ctx.session.user.id }).getAll()
      return ctx.db.wishlist.delete(wishlists.map(w => w.id))
    }),
  getCartItems: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.cartItem.select(["artwork.*"]).filter({ cart: { user_id: ctx.session.user.id } }).getAll()
    }),
  addToCart: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: artworkId }) => {
      const cart = await ctx.db.cart.createOrUpdate({ user_id: ctx.session.user.id })
      const artwork = await ctx.db.artwork.read(artworkId)
      await ctx.db.cartItem.create({ cart, artwork })
      return ctx.db.cartItem.select(["artwork.*"]).sort("xata.createdAt").getFirst()
    }),
  removeFromCart: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: cartItemId }) => {
      return ctx.db.cartItem.deleteOrThrow(cartItemId)
    }),
  deleteArtworkFromCart: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: artworkId }) => {
      const cartItems = await ctx.db.cartItem.select(["id"]).filter({ "artwork.id": artworkId }).getAll()
      await ctx.db.cartItem.delete(cartItems.map(c => c.id))
    }),
  clearCart: protectedProcedure
    .mutation(async ({ ctx }) => {
      const cart = await ctx.db.cart.filter({ user_id: ctx.session.user.id }).getFirstOrThrow()
      const cartItems = await ctx.db.cartItem.select(["id"]).filter({ cart }).getAll()
      await ctx.db.cartItem.delete(cartItems.map(c => c.id))
    })
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
