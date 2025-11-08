import { useQuery } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  createFileRoute,
  useRouter,
} from "@tanstack/react-router";
import { z } from "zod";
import { postsPageQueryOptions } from "../utils/posts.server";

export const Route = createFileRoute("/posts")({
  validateSearch: z.object({ page: z.coerce.number().min(1).default(1) }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsPageQueryOptions(1, 10));
  },
  head: () => ({
    meta: [{ title: "Posts" }],
  }),
  component: PostsComponent,
});

function PostsComponent() {
  const router = useRouter();
  const { page } = Route.useSearch();
  const limit = 10;
  const postsQuery = useQuery(postsPageQueryOptions(page, limit));

  const gotoPage = (next: number) =>
    router.navigate({ to: "/posts", search: { page: next } });

  if (postsQuery.isLoading) {
    return <div className="p-2">Loading posts...</div>;
  }

  if (postsQuery.isError) {
    return (
      <div className="p-2 text-red-600">
        Error: {(postsQuery.error as Error)?.message}
      </div>
    );
  }

  const data = postsQuery.data ?? [];
  const hasPrev = page > 1;
  const hasNext = data.length === limit;

  return (
    <div className="p-2 space-y-3">
      <div className="flex items-center gap-2">
        <button
          disabled={!hasPrev}
          onClick={() => gotoPage(page - 1)}
          className="px-2 py-1 rounded-sm bg-gray-700 text-white disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-sm">Page {page}</div>
        <button
          disabled={!hasNext}
          onClick={() => gotoPage(page + 1)}
          className="px-2 py-1 rounded-sm bg-gray-700 text-white disabled:opacity-50"
        >
          Next
        </button>
        {/* <Link
          to="/posts/infinite"
          className="ml-auto px-2 py-1 rounded-sm bg-blue-600 text-white"
        >
          Infinite Scroll Demo
        </Link> */}
      </div>
      <div className="p-2 flex gap-2">
        <ul className="list-disc pl-4">
          {[...data, { id: "i-do-not-exist", title: "Non-existent Post" }].map(
            (post) => {
              return (
                <li key={post.id} className="whitespace-nowrap">
                  <Link
                    to="/posts/$postId"
                    params={{
                      postId: post.id,
                    }}
                    className="block py-1 text-blue-800 hover:text-blue-600"
                    activeProps={{ className: "text-black font-bold" }}
                  >
                    <div>{post.title.substring(0, 20)}</div>
                  </Link>
                </li>
              );
            }
          )}
        </ul>
        <hr />
        <Outlet />
      </div>
    </div>
  );
}
