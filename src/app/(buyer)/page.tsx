import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { HeroParallax } from "~/components/ui/hero-parallax";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  const products = await api.artwork.all.query({ limit: 15 });

  return (
    <main>
      <HeroParallax products={products.map(({ name: title, image, id }) => ({ title, thumbnail: image?.url ?? '', link: `artworks/${id}` }))} />
    </main>
  );
}
