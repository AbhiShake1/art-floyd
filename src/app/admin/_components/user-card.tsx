import { api } from "~/trpc/server";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import React from "react";

export async function UserCard() {
  const users = await api.user.all.query()

  return <Card className="xl:col-span-2">
    <CardHeader className="flex flex-row items-center">
      <div className="grid gap-2">
        <CardTitle>Users</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-left">Email</TableHead>
            <TableHead className="text-left">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            users.map(({ id, name, role, email }) => {
              return <TableRow key={id}>
                <TableCell>
                  <div className="font-medium">{name}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{email}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{role}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {role !== "admin" && <PromoteButton id={id} />}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            })
          }
        </TableBody>
      </Table>
    </CardContent>
  </Card>
}

export function PromoteButton({ id }: { id: string }) {
  return <form action={async () => {
    "use server"

    await api.user.promoteToAdmin.mutate(id)
    redirect("/admin")
  }}>
    <button type="submit">Promote to admin</button>
  </form>
}
