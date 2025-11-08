import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

const slowQueryOptions = () =>
  queryOptions({
    queryKey: ["streaming", "slow"],
    queryFn: async () => {
      // Simulate a slow server function
      await new Promise((r) => setTimeout(r, 2500));
      return { message: "This content arrived slowly." };
    },
  });

export const Route = createFileRoute("/streaming")({
  head: () => ({ meta: [{ title: "Streaming & Suspense" }] }),
  component: StreamingComponent,
});

function StreamingComponent() {
  return (
    <div className="p-2 space-y-4">
      <h3 className="text-xl font-bold">Streaming with Suspense</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        The fast content below renders immediately. The slow content is wrapped
        in a Suspense boundary and streams in later with its fallback.
      </p>
      <div className="space-y-2">
        <FastContent />
        <Suspense
          fallback={<div className="text-sm">Loading slow content…</div>}
        >
          <SlowContent />
        </Suspense>
      </div>
    </div>
  );
}

function FastContent() {
  return (
    <div className="rounded-md border p-3">
      <div className="font-semibold">Fast Content</div>
      <div className="text-sm text-gray-700">Rendered instantly.</div>
    </div>
  );
}

function SlowContent() {
  const slow = useSuspenseQuery(slowQueryOptions());
  return (
    <div className="rounded-md border p-3">
      <div className="font-semibold">Slow Content</div>
      <div className="text-sm text-gray-700">{slow.data.message}</div>
    </div>
  );
}
