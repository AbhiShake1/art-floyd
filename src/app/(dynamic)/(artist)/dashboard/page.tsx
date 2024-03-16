import { api } from "~/trpc/server"
import { AreaChart } from '@tremor/react';
import { omit } from "lodash";

export default async function Page() {
  const analytics = await api.dashboard.analytics.query()
  const keys = Object.keys(omit(analytics.reduce((p, c) => ({ ...p, ...c })), "date"))

  return <div className="flex flex-col justify-center h-screen space-y-3">
    <AreaChart className="mt-4 h-72" data={analytics} index="date" yAxisWidth={65} categories={keys} />
  </div>
}
