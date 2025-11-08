import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import axios from "redaxios";
import z from "zod";

import type { User } from "~/utils/users";

export const Route = createFileRoute("/api/users/$userId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        console.info(`Fetching users by id=${params.userId}... @`, request.url);
        try {
          const res = await axios.get<User>(
            "https://jsonplaceholder.typicode.com/users/" + params.userId
          );
          return json({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
          });
        } catch (e) {
          console.error(e);
          return json({ error: "User not found" }, { status: 404 });
        }
      },
      PUT: async ({ request, params, context }) => {
        const user = (context as any).user;
        if (!user) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }
        console.info(`Updating user id=${params.userId}... @`, request.url);
        const schema = z.object({
          name: z.string().min(1),
          email: z.string().email(),
        });
        let body: unknown;
        try {
          body = await request.json();
        } catch (e) {
          return json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return json(
            { error: "Validation failed", details: parsed.error.format() },
            { status: 400 }
          );
        }
        try {
          const res = await axios.put<User>(
            "https://jsonplaceholder.typicode.com/users/" + params.userId,
            parsed.data
          );
          const updated = res.data;
          return json({
            id: updated.id,
            name: updated.name,
            email: updated.email,
          });
        } catch (e) {
          console.error(e);
          return json({ error: "Failed to update user" }, { status: 500 });
        }
      },
      DELETE: async ({ request, params }) => {
        console.info(`Deleting user id=${params.userId}... @`, request.url);
        try {
          await axios.delete(
            "https://jsonplaceholder.typicode.com/users/" + params.userId
          );
          return json({ ok: true });
        } catch (e) {
          console.error(e);
          return json({ error: "Failed to delete user" }, { status: 500 });
        }
      },
    },
  },
});
