import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cartRouter = createTRPCRouter({
  get: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.cartItem.select(["artwork.*"]).filter({ cart: { user_id: ctx.user.id } }).getAll()
    }),
  add: protectedProcedure
    .input(z.object({ artworkId: z.string() }))
    .mutation(async ({ ctx, input: { artworkId } }) => {
      const userCart = await ctx.db.cart.filter({ user_id: ctx.user.id }).getFirst()
      const cart = await ctx.db.cart.createOrUpdate(userCart?.id, { user_id: ctx.user.id })
      const artwork = await ctx.db.artwork.read(artworkId)
      await ctx.db.cartItem.create({ cart, artwork })
      return ctx.db.cartItem.select(["artwork.*"]).sort("xata.createdAt").getFirst()
    }),
  remove: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: cartItemId }) => {
      return ctx.db.cartItem.deleteOrThrow(cartItemId)
    }),
  deleteArtwork: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: artworkId }) => {
      const cartItems = await ctx.db.cartItem.select(["id"]).filter({ "artwork.id": artworkId }).getAll()
      await ctx.db.cartItem.delete(cartItems.map(c => c.id))
    }),
  clear: protectedProcedure
    .mutation(async ({ ctx }) => {
      const cart = await ctx.db.cart.filter({ user_id: ctx.user.id }).getFirstOrThrow()
      const cartItems = await ctx.db.cartItem.select(["id"]).filter({ cart }).getAll()
      await ctx.db.cartItem.delete(cartItems.map(c => c.id))
    }),
})
