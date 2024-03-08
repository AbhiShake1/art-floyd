import { DirectionAwareHover } from "~/components/ui/direction-aware-hover";
import { api } from "~/trpc/server"

export default async function Page() {
  const artworks = await api.artwork.all.query()
  return <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">{
    artworks.map(({ name, id, image, style, size, price }) => {
      return <DirectionAwareHover key={id} imageUrl={image?.url ?? ''}>
        <p className="font-bold text-xl">{name}</p>
        <p className="font-normal text-sm">{size} | {style} | {price}$</p>
      </DirectionAwareHover>
    })
  }</div>
}
