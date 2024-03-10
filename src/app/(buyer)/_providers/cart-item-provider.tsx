"use client"

import { useEffect } from "react";
import { useCart } from "~/stores/cart";
import { api } from "~/trpc/react"

export function CartItemProvider({ children }: React.PropsWithChildren) {
  const cart = useCart()
  const { data } = api.artwork.getCartItems.useQuery();
  useEffect(() => {
    if (data) cart.setItems(data)
  }, [data])

  return children;
}
