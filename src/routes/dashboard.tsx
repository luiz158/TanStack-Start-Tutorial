import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "~/components/protected";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <RequireAuth>
      <div className="p-2">
        <div className="flex gap-4 mb-4">
          <Link
            to="/dashboard"
            activeOptions={{ exact: true }}
            activeProps={{ className: "font-bold underline" }}
            className="text-blue-800 hover:text-blue-600"
          >
            Overview
          </Link>
          <Link
            to="/dashboard/profile"
            activeProps={{ className: "font-bold underline" }}
            className="text-blue-800 hover:text-blue-600"
          >
            Profile
          </Link>
          <Link
            to="/dashboard/settings"
            activeProps={{ className: "font-bold underline" }}
            className="text-blue-800 hover:text-blue-600"
          >
            Settings
          </Link>
        </div>
        <hr />
        <Outlet />
      </div>
    </RequireAuth>
  );
}
