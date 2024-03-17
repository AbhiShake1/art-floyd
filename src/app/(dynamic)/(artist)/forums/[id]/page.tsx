import { AnimatedTooltip } from "~/components/ui/animated-tooltip"
import { api } from "~/trpc/server"
import { AddForumReplyButton } from "./_components/add-forum-reply-button"
import { Card, CardTitle, CardDescription, CardHeader } from "~/components/ui/card"

import { getServerAuthSession } from "~/server/auth"
import { DeleteForumReplyButton } from "./_components/delete-forum-reply-button"
import { BackButton } from "~/components/ui/back-button"
import { fetchFromApi } from "~/lib/service"
import { type inferProcedureOutput } from "@trpc/server"
import { type AppRouter } from "~/server/api/root"

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const user = await getServerAuthSession()
  // const { id: fId, title, description, owner, xata: { createdAt }, replies } = await api.forum.byId.query(id)

  const { id: fId, title, description, owner, xata: { createdAt }, replies } = await fetchFromApi<inferProcedureOutput<AppRouter["forum"]["byId"]>>(`forum/byId/?id=${id}`)

  return <div className="flex flex-col justify-start items-start space-y-2 h-screen pt-32 px-8">
    <div className="flex flex-row items-center space-x-3">
      <BackButton />
      <AnimatedTooltip className="scale-50" items={[
        {
          id: 1,
          name: owner?.name ?? "",
          designation: "",
          image: owner?.image ?? '',
        },
      ]} />
      <h1 className="font-bold text-3xl">{title}</h1>
      <h4 className="opacity-40">Asked on {new Date(createdAt).toISOString().substring(0, 10)}</h4>
    </div>
    <h3>{description}</h3>
    <section className="py-12">
      <AddForumReplyButton forumId={fId} />
    </section>
    <section className="flex flex-col items-start justify-start space-y-4">
      <h1 className="font-bold text-2xl pb-8">Answers</h1>
      {
        replies.map(r => <Card key={r.id}>
          <CardHeader className="flex flex-row items-start space-x-3">
            <CardTitle className="flex flex-row skew-x-2 items-start justify-start mx-3">
              <AnimatedTooltip items={[
                {
                  id: 1,
                  name: r.sender?.name ?? "",
                  designation: r.sender?.role ?? "",
                  image: r.sender?.image ?? "",
                },
              ]} />
            </CardTitle>
            <div className="relative">
              {r.sender?.id === user?.user?.id && <DeleteForumReplyButton replyId={r.id} />}
              <div className="flex flex-col space-y-2">
                <CardDescription>{r.message}</CardDescription>
                <CardDescription className="opacity-40">
                  Answered on {new Date(r.xata.createdAt).toISOString().substring(0, 10)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>)
      }
    </section>
  </div>
}
