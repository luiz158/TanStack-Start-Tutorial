import { createServerFn } from "@tanstack/react-start";
import z from "zod";

type Session = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

// In-memory session store for demo purposes.
const sessions = new Map<string, Session>();

const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => loginInput.parse(data))
  .handler(async ({ data }) => {
    // Demo: hard-coded user verification
    if (data.email !== "user@example.com" || data.password !== "password") {
      throw new Error("Invalid credentials");
    }
    const token = Math.random().toString(36).slice(2);
    const session: Session = {
      token,
      user: { id: "1", email: data.email, name: "Demo User" },
    };
    sessions.set(token, session);
    return session;
  });

const tokenInput = z.object({ token: z.string().min(1) });

export const getCurrentUser = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenInput.parse(data))
  .handler(async ({ data }) => {
    const session = sessions.get(data.token);
    if (!session) {
      throw new Error("Not authenticated");
    }
    return session.user;
  });

export const logoutUser = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenInput.parse(data))
  .handler(async ({ data }) => {
    sessions.delete(data.token);
    return { ok: true };
  });

// Helper to retrieve a session by token for server handlers/middleware
export function getSessionByToken(token: string | null | undefined) {
  if (!token) return null;
  return sessions.get(token) ?? null;
}
