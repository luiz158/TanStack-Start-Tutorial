import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { usersQueryOptions } from "~/utils/users";

export const Route = createFileRoute("/ssr/users")({
  loader: async ({ context }) => {
    // Prefetch users on the server so the HTML includes the data.
    await context.queryClient.ensureQueryData(usersQueryOptions());
  },
  head: () => ({
    meta: [{ title: "SSR Users" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const usersQuery = useSuspenseQuery(usersQueryOptions());
  const users = usersQuery.data;
  return (
    <div className="p-2 space-y-3">
      <div className="flex items-center gap-2">
        <Link
          to="/users"
          className="px-2 py-1 rounded-sm bg-gray-200 text-xs uppercase font-black"
        >
          Users (client comparison)
        </Link>
      </div>
      <h3 className="text-xl font-bold">Server-Rendered Users</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        This page is server-rendered. Open "View Source" in your browser to see
        the user list HTML in the initial response. The client hydrates without
        a loading state.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {users.map((user) => (
          <Link
            key={user.id}
            to="/users/$userId"
            params={{ userId: String(user.id) }}
            className="rounded-md border p-3 hover:bg-gray-50"
            activeProps={{ className: "bg-gray-100 font-bold" }}
          >
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
