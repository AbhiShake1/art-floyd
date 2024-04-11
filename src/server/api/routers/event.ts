import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { resend } from "~/lib/resend";
import ArtworkInvitationEmail from "~/components/artwork-invitation-email";

export const eventRouter = createTRPCRouter({
	all: publicProcedure
		.query(({ ctx }) => {
			return ctx.db.event.getAll({ sort: [{ "xata.updatedAt": "desc" }, { "xata.createdAt": "desc" }] })
		}),
	create: protectedProcedure
		.input(z.object({ dateTime: z.date().min(new Date()), location: z.string().min(1), name: z.string().min(1), description: z.ostring() }))
		.mutation(({ ctx, input: { dateTime, location, name, description } }) => {
			return ctx.db.event.create({ dateTime, location, name, description })
		}),
	request: protectedProcedure
		.input(z.object({ email: z.string().email(), phone: z.string().min(1), eventId: z.string().min(1) }))
		.mutation(async ({ ctx, input: { email, phone, eventId } }) => {
			const event = await ctx.db.event.readOrThrow(eventId)
			void resend.emails.send({
				from: "ArtFloyd<invitation@kyanitenepal.com>",
				to: [email],
				subject: `Invitation for ${event.name}`,
				react: ArtworkInvitationEmail({
					email,
					eventName: event.name ?? "",
					username: ctx.user.fullName ?? "",
					location: event.location ?? "",
					dateTime: event.dateTime?.toLocaleString() ?? "",
				}),
			})
			return ctx.db.eventRequest.create({ user: ctx.user.id, email, phone, event: eventId })
		}),
})
