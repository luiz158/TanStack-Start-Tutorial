import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import React from "react";
import z from "zod";
import { createUser } from "~/utils/users.server";

export const Route = createFileRoute("/users/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const schema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
      });
      const parsed = schema.safeParse({ name, email });
      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message || "Invalid input";
        throw new Error(message);
      }
      // If validation passes, proceed with the mutation
      return createUser({ data: parsed.data });
    },
    onSuccess: async () => {
      // Invalidate and refetch users query to reflect the new user
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      // Navigate back to the users list
      router.navigate({ to: "/users" });
    },
    onError: (err) => {
      setError((err as Error).message);
    },
  });

  return (
    <div className="p-2 space-y-3">
      <div className="flex items-center gap-2">
        <Link
          to="/users"
          className="px-2 py-1 rounded-sm bg-gray-200 text-xs uppercase font-black"
        >
          Users
        </Link>
      </div>
      <h4 className="text-xl font-bold">Add New User</h4>
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
          {mutation.isPending ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
