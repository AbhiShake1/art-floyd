import { api } from "~/trpc/server";
import { OrdersTable } from "./_components/table";
import SuperJSON from "superjson";

export const dynamic = "force-dynamic"

export default async function Page() {
  const orders = await api.order.my.query()

  return <OrdersTable orders={SuperJSON.stringify(orders)} />
}
