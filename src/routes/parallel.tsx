import { useQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { postsQueryOptions } from "~/utils/posts.server";
import { usersQueryOptions } from "~/utils/users";

export const Route = createFileRoute("/parallel")({
  component: RouteComponent,
});

function RouteComponent() {
  const result = useQueries({
    queries: [postsQueryOptions(), usersQueryOptions()],
  });
  const [postsResult, usersResult] = result;
  return (
    <div className="p-2 space-y-2">
      <div className="font-bold">Parallel Queries Demo</div>
      <div className="space-y-1">
        <div>
          Posts:{" "}
          {postsResult.isLoading
            ? "Loading..."
            : postsResult.isError
              ? "Error"
              : (postsResult.data?.length ?? 0)}
        </div>
        <div>
          Users:{" "}
          {usersResult.isLoading
            ? "Loading..."
            : usersResult.isError
              ? "Error"
              : (usersResult.data?.length ?? 0)}
        </div>
      </div>
    </div>
  );
}
