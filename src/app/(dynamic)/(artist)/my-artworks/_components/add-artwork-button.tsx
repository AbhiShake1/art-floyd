import { IconPlus } from "@tabler/icons-react";
import { type inferProcedureInput } from "@trpc/server";
import { parseInt } from "lodash";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/server";

type CreateArtwork = inferProcedureInput<AppRouter["artwork"]["create"]>

async function addArtwork(formData: FormData) {
  "use server"

  const name = formData.get("name") as CreateArtwork["name"]
  const size = formData.get("size") as CreateArtwork["size"]
  const style = formData.get("style") as CreateArtwork["style"]
  const category = formData.get("") as CreateArtwork["category"]
  const availableQuantity = parseInt((formData.get("availableQuantity") ?? "0") as string);
  const price = parseInt((formData.get("prrice") ?? "0") as string);

  await api.artwork.create.mutate({ availableQuantity, price, category, name, size, style })
	// await api.artwork.my.revalidate()
}

export function AddArtworkButton() {
  return <Dialog>
    <DialogTrigger asChild>
      <button className="w-full h-full border border-gray-50 border-opacity-25 rounded-lg flex items-center justify-center scale-75 hover:scale-100 duration-200 transition-all">
        <IconPlus className="w-16 h-16 font-bold" />
      </button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <form className="w-full" action={addArtwork}>
        <DialogHeader>
          <DialogTitle>Add artwork</DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <InputContainer name="name" placeholder="Mona Lisa" display="Name" />
          <InputContainer name="size" placeholder="32'" display="Size" />
          <InputContainer name="style" placeholder="cubism" display="Style" />
          <InputContainer name="category" placeholder="abstract" display="Category" />
          <InputContainer name="availableQuantity" placeholder="2" display="Available Quantity" />
          <InputContainer name="price" placeholder="$1000" display="Price" />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form >
    </DialogContent>
  </Dialog>
}

function InputContainer({ name, display, placeholder }: { name: string, display: string, placeholder: string }) {
  return <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={name} className="text-right">
      {display}
    </Label>
    <Input id={name} name={name} placeholder={placeholder} className="col-span-3" />
  </div>
}
