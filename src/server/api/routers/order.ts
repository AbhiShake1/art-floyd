import { groupBy } from "lodash";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
	my: protectedProcedure
		.query(async ({ ctx }) => {
			const orders = await ctx.db.orderArtwork
				.select(["order.*", "artwork.*", "order.user.*"])
				.getAll()
			const res = orders
				.filter(o => o.artwork && o.order && o.order.user)
				.map(o => ({
					...o.order!,
					user: o.order!.user!,
					artworkName: o.artwork!.name,
					oId: o.order!.id,
					total: o.artwork!.price,
				}))
			const result = groupBy(res, "oId")
			const grouedOrders = Object.values(result)
			const r = grouedOrders
				.flatMap(o => o
					.reduce(
						(p, c) => ({
							...p,
							artworkName: `${p.artworkName}, ${c.artworkName}`,
							total: p.total + c.total
						})
					)
				)
			console.log(r)
			return r
		}),
})
