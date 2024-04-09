"use server"

import { currentUser } from "@clerk/nextjs/server"
import { env } from "~/env"

export async function fetchFromApi<T>(input: string, init?: RequestInit): Promise<T> {
  const user = await currentUser()

  const res = await fetch(`${env.API_BASE_URL}/${input}`, {
    ...init,
    headers: {
      ...init?.headers,
      "Authorization": `Bearer ${user?.id}`,
    },
  })

  return res.json() as Promise<T>
}
