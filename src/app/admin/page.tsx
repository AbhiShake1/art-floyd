import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { UserCard } from "./_components/user-card";

export default async function Page() {
	const user = await currentUser()
	if(user?.publicMetadata?.role !== "admin") return notFound()

  return <UserCard />
}
