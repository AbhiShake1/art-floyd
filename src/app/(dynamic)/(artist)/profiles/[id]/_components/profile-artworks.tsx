import { DirectionAwareHover } from "~/components/ui/direction-aware-hover";
import { api } from "~/trpc/server";
import { type NextauthUsers } from "~/xata";

export async function ProfileArtworks({ user }: { user: NextauthUsers }) {
  const artworks = await api.artwork.by.query(user.id)

  if (user.role !== "artist") return null

  return <div className="flex flex-col justify-center items-center pt-6">
    <h1 className="text-3xl font-bold">Recent Artworks</h1>
    <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto justify-items-center">{
      artworks?.map((artwork) => {
        const { name, id, image, style, size, price } = artwork
        return <DirectionAwareHover key={id} imageUrl={image?.url ?? ''}>
          <p className="font-bold text-xl">{name}</p>
          <p className="font-normal text-sm">{size} | {style} | {price}$</p>
        </DirectionAwareHover>
      })
    }</div>
  </div>
}
