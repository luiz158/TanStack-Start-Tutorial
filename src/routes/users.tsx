import {
  Link,
  Outlet,
  createFileRoute,
  useRouter,
} from "@tanstack/react-router";
import { usersQueryOptions, type User } from "../utils/users";
import z from "zod";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const Route = createFileRoute("/users")({
  validateSearch: z.object({ q: z.string().optional() }),
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(usersQueryOptions());
    return data;
  },
  component: UsersComponent,
});

function UsersComponent() {
  // const users = Route.useLoaderData();
  const { q = "" } = Route.useSearch();
  const usersQuery = useQuery(usersQueryOptions(q));
  const router = useRouter();
  const [input, setInput] = React.useState(q);
  React.useEffect(() => {
    setInput(q);
  }, [q]);
  React.useEffect(() => {
    const id = setTimeout(() => {
      router.navigate({
        to: "/users",
        search: (prev) => ({ q: input || undefined }),
      });
    }, 300);
    return () => clearTimeout(id);
  }, [input, router]);

  const Skeleton = () => (
    <div className="rounded-md border p-3 space-y-2 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );

  const isEmpty = usersQuery.data && usersQuery.data.length === 0;

  if (usersQuery.isError) {
    return (
      <div className="p-2 text-red-600">
        Error: {(usersQuery.error as Error)?.message}
      </div>
    );
  }

  const data = usersQuery.data ?? [];

  return (
    <div className="p-2 flex gap-4">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search users by name or email"
            className="border px-2 py-1 rounded-sm w-full"
          />
          <Link
            to="/users/new"
            className="px-2 py-1 rounded-sm bg-green-600 text-white text-xs uppercase font-black"
          >
            Add User
          </Link>
        </div>
        {usersQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-gray-600">
            No users found. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.map((user) => (
              <Link
                key={user.id}
                to="/users/$userId"
                params={{ userId: String(user.id) }}
                className="rounded-md border p-3 hover:bg-gray-400"
                activeProps={{ className: "bg-gray-400 font-bold" }}
              >
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="w-px bg-gray-200" />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
