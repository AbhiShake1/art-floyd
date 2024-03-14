import { IconPlus } from "@tabler/icons-react";
import { type inferProcedureInput } from "@trpc/server";
import { parseInt } from "lodash";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input, type InputProps } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/server";

type CreateArtwork = inferProcedureInput<AppRouter["artwork"]["create"]>

async function addArtwork(formData: FormData) {
  "use server"

  const name = formData.get("name") as CreateArtwork["name"]
  const size = formData.get("size") as CreateArtwork["size"]
  const style = formData.get("style") as CreateArtwork["style"]
  const category = formData.get("category") as CreateArtwork["category"]
  const availableQuantity = parseInt((formData.get("availableQuantity") ?? "0") as string)
  const price = parseInt((formData.get("price") ?? "0") as string)
  const image = formData.get("image") as File | undefined
  const attachments = formData.getAll("secondaryAttachments") as File[] | undefined

  const artwork = await api.artwork.create.mutate({
    availableQuantity, price, category, name, size, style,
    // @ts-expect-error xxx
    image: image && {
      name: `${image.name}${image.lastModified}`,
      mediaType: image.type,
      base64Content: "",
    },
    // @ts-expect-error xxx
    secondaryAttachments: attachments?.map(({ type, name, lastModified }) => ({
      name: `${name}${lastModified}`,
      mediaType: type,
      base64Content: "",
    })),
  })

  await fetch(artwork.image!.uploadUrl!, { method: 'PUT', body: image });

  for (const attachment of artwork.secondaryAttachments ?? []) {
    await fetch(attachment.uploadUrl!, { method: 'PUT', body: image });
  }

  revalidatePath("/my-artworks")
  redirect("/my-artworks")
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
          <InputContainer required name="name" placeholder="Mona Lisa" display="Name" />
          <InputContainer required name="size" placeholder="32'" display="Size" />
          <InputContainer required name="style" placeholder="cubism" display="Style" />
          <InputContainer required name="category" placeholder="abstract" display="Category" />
          <InputContainer required name="availableQuantity" placeholder="2" type="number" display="Available Quantity" />
          <InputContainer required name="price" placeholder="1000" type="number" display="Price" />
          <InputContainer required name="image" display="Image" accept="image/png, image/jpeg" type="file" />
          <InputContainer name="secondaryAttachments" display="Attachments" accept="image/png, image/jpeg" type="file" multiple />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form >
    </DialogContent>
  </Dialog>
}

function InputContainer({
  name, display, placeholder, className, ...rest
}: { name: string, display: string } & InputProps) {
  return <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={name} className="text-right">
      {display}
    </Label>
    <Input id={name} name={name} placeholder={placeholder} {...rest} className={cn("col-span-3", className)} />
  </div>
}
