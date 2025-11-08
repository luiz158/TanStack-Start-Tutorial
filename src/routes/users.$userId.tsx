import { createFileRoute, Link } from "@tanstack/react-router";
import { NotFound } from "src/components/NotFound";
import { UserErrorComponent } from "src/components/UserError";
import { userQueryOptions, type User } from "../utils/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ context, params: { userId } }) => {
    await context.queryClient.ensureQueryData(userQueryOptions(userId));
  },
  errorComponent: UserErrorComponent,
  component: UserComponent,
  notFoundComponent: () => {
    return <NotFound>User not found</NotFound>;
  },
});

function UserComponent() {
  const params = Route.useParams();
  const queryClient = useQueryClient();
  const userQuery = useQuery(userQueryOptions(params.userId));
  const deleteMutation = useMutation({
    mutationFn: async () => {
      queryClient.removeQueries({
        queryKey: ['user', { userId: params.userId }]
      })
      await queryClient.invalidateQueries({
        queryKey: ['users']
      })
      window.history.back();
    }
  })

  if (userQuery.isLoading) {
    return <div className="p-2">Loading user...</div>;
  }

  if (userQuery.isError) {
    return (
      <div className="p-2 text-red-600">
        Error: {(userQuery.error as Error)?.message}
      </div>
    );
  }

  const user = userQuery.data!;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.history.back()}
          className="px-2 py-1 rounded-sm bg-gray-700 text-white text-xs uppercase font-black"
        >
          Back
        </button>
        <Link
          to="/users"
          className="px-2 py-1 rounded-sm bg-gray-700 text-xs uppercase font-black"
        >
          Users
        </Link>
        <Link
          to="/users/$userId/edit"
          params={{ userId: params.userId }}
          className="px-2 py-1 rounded-sm bg-blue-600 text-white text-xs uppercase font-black"
        >
          Edit
        </Link>
        <button
          onClick={() => {
            if (confirm('Delete this user?')) {
              deleteMutation.mutate()
            }
          }}
          className="px-2 py-1 rounded-sm bg-red-600 text-white text-xs uppercase font-black"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      <h4 className="text-xl font-bold underline">{user.name}</h4>
      <div className="text-sm">{user.email}</div>
    </div>
  );
}
