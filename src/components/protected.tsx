import * as React from "react";
import { useRouter, useLocation } from "@tanstack/react-router";
import { useAuth } from "~/utils/auth-context";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const location = useLocation();

  React.useEffect(() => {
    if (!user) {
      const redirect = location.pathname + location.search;
      router.navigate({ to: "/login", search: { redirect } });
    }
  }, [user, router, location]);

  if (!user) return null;
  return <>{children}</>;
}
