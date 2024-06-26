"use client"

import { IconShoppingCart } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useCart } from "~/stores/cart";
import { api } from "~/trpc/react";
import { type CartItem } from "~/xata";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = { artworkId: string, artworkName: string }

export function AddToCartButton({ artworkId, artworkName }: Props) {
  const router = useRouter()
  const utils = api.useUtils()

  const addToCart = api.cart.add.useMutation({
    async onSuccess(data) {
      await utils.cart.invalidate()
      router.refresh()
      toast.success(`${artworkName} added to cart`)
      cart.add(data as CartItem)
    },
  })
  const cart = useCart()

  return <Button variant="ghost" disabled={addToCart.isLoading} className="rounded-full p-2" onClick={() => {
    addToCart.mutate({ artworkId })
  }}>
    {!addToCart.isLoading && <IconShoppingCart className='w-6 h-6' />}
    {addToCart.isLoading && <Loader className="animate-spin" />}
  </Button>
}
