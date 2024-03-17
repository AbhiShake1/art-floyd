import { api } from "~/trpc/server"
import { AreaChart } from '@tremor/react';
import { omit } from "lodash";
import { unstable_noStore } from "next/cache";
import { fetchFromApi } from "~/lib/service";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

export default async function Page() {
  unstable_noStore()
  // const analytics = await api.dashboard.analytics.query()

	const analytics = await fetchFromApi<inferProcedureOutput<AppRouter["dashboard"]["analytics"]>>("dashboard/analytics/")

  const keys = Object.keys(omit(analytics.reduce((p, c) => ({ ...p, ...c })), "date"))

  return <div className="flex flex-col justify-center h-screen space-y-3">
    <AreaChart className="mt-4 h-72" data={analytics} index="date" yAxisWidth={65} categories={keys} />
  </div>
}
