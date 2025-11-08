import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/profile")({
  component: DashboardProfile,
});

function DashboardProfile() {
  return (
    <div className="p-2 space-y-2">
      <h3 className="text-xl font-bold">Profile</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        This is your profile section.
      </p>
    </div>
  );
}
