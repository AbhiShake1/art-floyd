"use server"

import { getServerAuthSession } from "~/server/auth"

export async function fetchFromApi<T>(input: string, init?: RequestInit): Promise<T> {
  const user = await getServerAuthSession()

  const res = await fetch(`http://127.0.0.1:8000/${input}`, {
    ...init,
    headers: {
			...init?.headers,
      "Authorization": `Bearer ${user?.user.id}`,
    },
  })

  return res.json() as Promise<T>
}
