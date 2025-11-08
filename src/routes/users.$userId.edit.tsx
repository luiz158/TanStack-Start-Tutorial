import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { userQueryOptions } from "~/utils/users";
import { updateUser } from "~/utils/users.server";

export const Route = createFileRoute("/users/$userId/edit")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(userQueryOptions(params.userId));
  },
  component: EditUserComponent,
});

function EditUserComponent() {
  const params = Route.useParams();
  const queryClient = useQueryClient();
  const userQuery = useQuery(userQueryOptions(params.userId));
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (userQuery.data) {
      setName(userQuery.data.name);
      setEmail(userQuery.data.email);
    }
  }, [userQuery.data]);

  const mutation = useMutation({
    mutationFn: async () => {
      const schema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
      });
      const parsed = schema.safeParse({ name, email });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Invalid input");
      }
      return updateUser({ data: { userId: params.userId, ...parsed.data } });
    },
    onSuccess: async (updated) => {
      // Update cache for user detail and invalidate list
      queryClient.setQueryData(["users", params.userId], updated);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      // Navigate back to user detail
      window.history.back();
    },
    onError: (err: unknown) => {
      setError((err as Error)?.message || "Failed to update user");
    },
  });

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

  return (
    <div className="p-2 space-y-3">
      <div className="flex items-center gap-2">
        <Link
          to="/users/$userId"
          params={{ userId: params.userId }}
          className="px-2 py-1 rounded-sm bg-gray-200 text-xs uppercase font-black"
        >
          Back to User
        </Link>
      </div>
      <h4 className="text-xl font-bold">Edit User</h4>
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <form
        className="space-y-2 max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          mutation.mutate();
        }}
      >
        <div className="space-y-1">
          <label className="text-sm font-semibold">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 rounded-sm w-full"
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-2 py-1 rounded-sm w-full"
            placeholder="jane@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-3 py-1 rounded-sm bg-blue-600 text-white"
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
