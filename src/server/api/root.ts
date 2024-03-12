import { createTRPCRouter } from "~/server/api/trpc";
import { artworkRouter } from "./routers/artwork";
import { userRouter } from "./routers/user";
import { orderRouter } from "./routers/order";
import { wishlistRouter } from "./routers/wishlist";
import { cartRouter } from "./routers/cart";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	artwork: artworkRouter,
	user: userRouter,
	order: orderRouter,
	wishlist: wishlistRouter,
	cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
