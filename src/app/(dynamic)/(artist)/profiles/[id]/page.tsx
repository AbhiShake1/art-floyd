import { notFound } from "next/navigation"
import { AnimatedTooltip } from "~/components/ui/animated-tooltip"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"
import { Bio } from "./_components/bio"
import { ProfileArtworks } from "./_components/profile-artworks"

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const session = await getServerAuthSession()
  const user = await api.user.withId.query(id)

  if (!user) return notFound()

  return <div className="flex flex-col space-y-4">
    <div className="bg-gradient-to-r from-red-300 relative to-purple-300 h-[20vh] m-8 rounded-xl">
      <Bio bio={user.bio ?? `I am a ${user.role}`} canEdit={user.id === session?.user.id} />
      <AnimatedTooltip className="absolute bottom-3 left-[48%] scale-[3]" items={[
        {
          id: 1,
          name: user.name ?? "",
          designation: user.role,
          image: user.image ?? '',
        },
      ]} />
    </div>
    <ProfileArtworks user={user} />
  </div>
}
