"use client"

import { IconShoppingCart } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { useCart } from "~/stores/cart";
import { api } from "~/trpc/react";

type Props = { artworkId: string }

export function AddToCartButton({ artworkId }: Props) {
  const addToCart = api.artwork.addToCart.useMutation({
    onSuccess(data) {
      // @ts-expect-error xxx
      cart.add(data)
    },
  })
  const cart = useCart()

  return <Button variant="ghost" className="rounded-full p-2" onClick={() => {
    addToCart.mutate(artworkId)
  }}>
    <IconShoppingCart className='w-6 h-6' />
  </Button>
}
