import { createFileRoute, Link, type ErrorComponentProps } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/error-demo')({
  validateSearch: z.object({ pass: z.coerce.boolean().optional() }),
  head: () => ({ meta: [{ title: 'Error Boundary Demo' }] }),
  errorComponent: ErrorDemoBoundary,
  component: ErrorDemoPage,
})

function ErrorDemoBoundary({ error, reset }: ErrorComponentProps) {
  return (
    <div className="p-2 space-y-3">
      <h3 className="text-xl font-bold">Route Error Boundary</h3>
      <div className="text-sm text-red-600">Error: {(error as Error)?.message}</div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => reset()}
          className="px-2 py-1 rounded-sm bg-gray-700 text-white text-xs uppercase font-black"
        >
          Retry
        </button>
        <Link
          to="/error-demo"
          search={{ pass: true }}
          className="px-2 py-1 rounded-sm bg-blue-600 text-white text-xs uppercase font-black"
        >
          Resolve (pass=true)
        </Link>
      </div>
    </div>
  )
}

function ErrorDemoPage() {
  const { pass } = Route.useSearch()

  if (!pass) {
    // Simulate a component error to demonstrate error boundaries
    throw new Error('Demo component failed. Toggle pass=true to succeed.')
  }

  return (
    <div className="p-2 space-y-2">
      <h3 className="text-xl font-bold">Succeeded</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Success because <code>pass=true</code> is set in the URL.
      </p>
    </div>
  )
}