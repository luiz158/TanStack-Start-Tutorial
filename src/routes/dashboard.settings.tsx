import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
  component: DashboardSettings,
})

function DashboardSettings() {
  return (
    <div className="p-2 space-y-2">
      <h3 className="text-xl font-bold">Settings</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Configure your preferences here.
      </p>
    </div>
  )
}