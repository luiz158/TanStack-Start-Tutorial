import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import z from "zod";
import { useAuth } from "~/utils/auth-context";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { login } = useAuth();
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = React.useState("user@example.com");
  const [password, setPassword] = React.useState("password");

  const mutation = useMutation({
    mutationFn: async () => {
      await login(email, password);
    },
    onSuccess: () => {
      router.navigate({ to: redirect || "/" });
    },
  });

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="flex flex-col gap-2"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="border p-2 rounded"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="border p-2 rounded"
          />
        </label>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          {mutation.isPending ? "Signing in…" : "Sign in"}
        </button>
        {mutation.isError ? (
          <div className="text-red-600 text-sm">
            {(mutation.error as Error)?.message || "Login failed"}
          </div>
        ) : null}
      </form>
      <p className="text-xs text-gray-600 mt-3">
        Demo credentials: user@example.com / password
      </p>
    </div>
  );
}
