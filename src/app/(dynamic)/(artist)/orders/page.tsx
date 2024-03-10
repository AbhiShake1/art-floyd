import { api } from "~/trpc/server";
import { OrdersTable } from "./_components/table";

export const dynamic = "force-dynamic"

export default async function Page() {
  const orders = await api.order.my.query()

  // @ts-expect-error xxx
  return <OrdersTable orders={orders} />
}
