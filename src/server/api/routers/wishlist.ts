import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const wishlistRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: artworkId }) => {
      const artwork = await ctx.db.artwork.readOrThrow(artworkId)
      return ctx.db.wishlist.create({ artwork, user: ctx.session.user.id })
    }),
  remove: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: artworkId }) => {
      const wishlists = await ctx.db.wishlist.filter({ "artwork.id": artworkId, "user.id": ctx.session.user.id }).getAll()
      return ctx.db.wishlist.delete(wishlists.map(w => w.id))
    }),
})
