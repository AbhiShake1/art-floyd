"use client"

import { IconShoppingCart } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { useCart } from "~/stores/cart";
import { api } from "~/trpc/react";
import { type CartItem } from "~/xata";

type Props = { artworkId: string }

export function AddToCartButton({ artworkId }: Props) {
  const addToCart = api.cart.add.useMutation({
    onSuccess(data) {
      cart.add(data as CartItem)
    },
  })
  const cart = useCart()

  return <Button variant="ghost" className="rounded-full p-2" onClick={() => {
    addToCart.mutate(artworkId)
  }}>
    <IconShoppingCart className='w-6 h-6' />
  </Button>
}
