"use client"

import { useState } from "react"
import { Input } from "~/components/ui/input"
import { type inferProcedureOutput, type inferProcedureInput } from "@trpc/server"
import { type AppRouter } from "~/server/api/root"

type Search = AppRouter["artwork"]["search"]

type Artworks = inferProcedureOutput<Search>

export function ArtworkSearchBar() {
  const searchedArtworks = useState<Artworks | undefined>();
  const search = useState<inferProcedureInput<Search> | undefined>();
  return <Input type="search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Browse Artist" />
}
