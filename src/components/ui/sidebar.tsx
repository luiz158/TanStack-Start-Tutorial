import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '~/lib/utils'

type NavItem = { to: string; label: string; exact?: boolean }

const primary: NavItem[] = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]
const data: NavItem[] = [
  { to: '/posts', label: 'Posts' },
  { to: '/users', label: 'Users' },
  { to: '/ssr/users', label: 'SSR Users' },
]
const demos: NavItem[] = [
  { to: '/server-fns', label: 'Server Fns' },
  { to: '/route-a', label: 'Pathless' },
  { to: '/deferred', label: 'Deferred' },
  { to: '/streaming', label: 'Streaming' },
  { to: '/real-time/polling', label: 'Polling' },
  { to: '/real-time/sse', label: 'SSE' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/optimization/code-splitting', label: 'Code Split' },
  { to: '/parallel', label: 'Parallel' },
  { to: '/error-demo', label: 'Error Demo' },
  { to: '/file-upload', label: 'File Upload' },
]

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'hidden md:flex md:w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950',
        className,
      )}
    >
      <div className="h-14 flex items-center px-3 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" activeOptions={{ exact: true }} className="font-semibold">TanStack Start</Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-6">
        <NavSection title="General" items={primary} />
        <NavSection title="Data" items={data} />
        <NavSection title="Demos" items={demos} />
      </nav>
    </aside>
  )
}

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <div className="px-2 mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            activeProps={{ className: 'font-medium bg-gray-100 dark:bg-gray-900' }}
            className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}