"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "~/components/ui/input"

export function ArtworkSearchBar({ search }: { search?: string }) {
  const router = useRouter();
  const pathname = usePathname()
  const [searchParams, setSearchParams] = useState(search)

  useEffect(() => {
    void router.replace(`${pathname}?q=${searchParams}`)
  }, [searchParams, pathname, router])

  return <Input type="search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Browse Artist" value={searchParams} onChange={(e) => setSearchParams(e.target.value)} />
}
