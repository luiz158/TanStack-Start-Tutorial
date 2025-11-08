import { Link } from "@tanstack/react-router";
import { useAuth } from "~/utils/auth-context";

export default function AuthHeader() {
  const { user, logout } = useAuth();
  if (!user) {
    return (
      <Link to="/login" activeProps={{ className: "font-bold" }}>
        Login
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">Signed in as {user.name}</span>
      <button
        onClick={() => logout()}
        className="px-2 py-1 rounded-sm bg-gray-700 text-white text-xs uppercase font-black"
      >
        Logout
      </button>
    </div>
  );
}
