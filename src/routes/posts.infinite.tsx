import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchPostsPage, PostType } from "~/utils/posts.server";

export const Route = createFileRoute("/posts/infinite")({
  component: RouteComponent,
});

function RouteComponent() {
  const limit = 10;
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["posts", "infinite", { limit }],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam) || 1;
      return fetchPostsPage({ data: { page, limit } });
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === limit ? allPages.length + 1 : undefined,
  });

  const pages = infiniteQuery.data?.pages as unknown as
    | PostType[][]
    | undefined;
  const posts = pages ? pages.flat() : [];

  return (
    <div className="p-2 space-y-3">
      <div className="flex items-center gap-2">
        <Link to="/posts" className="px-2 py-1 rounded-sm bg-gray-700">
          Back to Posts
        </Link>
        <div className="text-sm">
          Loaded pages: {infiniteQuery.data?.pages?.length ?? 0}
        </div>
      </div>
      {infiniteQuery.isError ? (
        <div className="text-red-600">Error: {infiniteQuery.error.message}</div>
      ) : null}
      <ul className="list-disc pl-4">
        {posts.map((post) => (
          <li key={post.id} className="whitespace-nowrap">
            <Link
              to="/posts/$postId"
              params={{ postId: post.id }}
              className="block py-1 text-blue-800 hover:text-blue-600"
            >
              <div>{post.title.substring(0, 30)}</div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <button
          onClick={() => infiniteQuery.fetchNextPage()}
          disabled={
            !infiniteQuery.hasNextPage || infiniteQuery.isFetchingNextPage
          }
          className="px-2 py-1 rounded-sm bg-blue-600 text-white disabled:opacity-50"
        >
          {infiniteQuery.isFetchingNextPage
            ? "Loading..."
            : infiniteQuery.hasNextPage
              ? "Load More"
              : "No More Posts"}
        </button>
      </div>
    </div>
  );
}
