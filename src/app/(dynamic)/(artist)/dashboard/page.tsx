"use client"

import { api } from "~/trpc/react"
import { AreaChart } from '@tremor/react';
import { omit } from "lodash";

export default function Page() {
  const { data: analytics } = api.dashboard.analytics.useQuery()

  if (!analytics) return null

  const keys = Object.keys(omit(analytics.reduce((p, c) => ({ ...p, ...c })), "date"))

  return <div className="flex flex-col justify-center h-screen space-y-3">
    <AreaChart className="mt-4 h-72" data={analytics} index="date" yAxisWidth={65} categories={keys} />
  </div>
}
