import { createMiddleware } from "@tanstack/react-start";
import { getSessionByToken } from "./auth.server";

export const loggingMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const start = Date.now();
    const url = new URL(request.url);
    console.info(`[MW] ${request.method} ${url.pathname}`);
    const result = await next();
    console.info(
      `[MW] ${request.method} ${url.pathname} done in ${Date.now() - start}ms`
    );
    return result;
  }
);


// Proper TanStack Start request middleware: Auth (skips GET)
// Attaches user to context for downstream handlers
export const authMiddleware = createMiddleware()
  .middleware([loggingMiddleware])
  .server(async ({ next, request, context }) => {
    if (request.method === "GET") {
      return next();
    }
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const session = getSessionByToken(token);
    if (!session) {
      // No auth; proceed without user context and let handlers enforce
      return next();
    }
    const baseContext = context ?? {};
    return next({ context: { ...baseContext, user: session.user } });
  });
