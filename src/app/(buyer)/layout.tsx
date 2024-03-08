import "~/styles/globals.css";

import { FloatingNav } from "~/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser, IconShoppingCart, IconBrandWish, IconLogin } from "@tabler/icons-react";
import { getServerAuthSession } from "~/server/auth";
import { AnimatedTooltip } from "~/components/ui/animated-tooltip";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} session={session} />
      {children}
    </div>
  );
}

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Artworks",
    link: "/browse-artwork",
    icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "For You",
    link: "/feed",
    icon: (
      <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
    ),
  },
  {
    name: "Cart",
    link: "/cart",
    icon: (
      <IconShoppingCart className="h-4 w-4 text-neutral-500 dark:text-white" />
    ),
  },
  {
    name: "Wishlist",
    link: "/wishlist",
    icon: (
      <IconBrandWish className="h-4 w-4 text-neutral-500 dark:text-white" />
    ),
  },
];
