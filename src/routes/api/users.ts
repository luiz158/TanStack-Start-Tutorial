import { createFileRoute } from "@tanstack/react-router";
import axios from "redaxios";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createMiddleware, json } from "@tanstack/react-start";
import type { User } from "~/utils/users";
import z from "zod";
import { authMiddleware, loggingMiddleware } from "~/utils/middleware";

// const userLoggerMiddleware = createMiddleware().server(async ({ next }) => {
//   console.info('In: /users')
//   console.info('Request Headers:', getRequestHeaders())
//   const result = await next()
//   result.response.headers.set('x-users', 'true')
//   console.info('Out: /users')
//   return result
// })

// const testParentMiddleware = createMiddleware().server(async ({ next }) => {
//   console.info('In: testParentMiddleware')
//   const result = await next()
//   result.response.headers.set('x-test-parent', 'true')
//   console.info('Out: testParentMiddleware')
//   return result
// })

// const testMiddleware = createMiddleware()
//   .middleware([testParentMiddleware])
//   .server(async ({ next }) => {
//     console.info('In: testMiddleware')
//     const result = await next()
//     result.response.headers.set('x-test', 'true')

//     // if (Math.random() > 0.5) {
//     //   throw new Response(null, {
//     //     status: 302,
//     //     headers: { Location: 'https://www.google.com' },
//     //   })
//     // }

//     console.info('Out: testMiddleware')
//     return result
//   })

export const Route = createFileRoute("/api/users")({
  server: {
    middleware: [loggingMiddleware, authMiddleware],
    handlers: {
      GET: async ({ request }) => {
        console.info("Fetching users... @", request.url);
        const res = await axios.get<Array<User>>(
          "https://jsonplaceholder.typicode.com/users"
        );
        const list = res.data.slice(0, 10);
        return json(
          list.map((u) => ({ id: u.id, name: u.name, email: u.email }))
        );
      },
      POST: async ({ request }) => {
        console.info("Creating user... @", request.url);
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
          const res = await axios.post<User>(
            "https://jsonplaceholder.typicode.com/users",
            parsed.data
          );
          const created = res.data;
          return json(
            { id: created.id, name: created.name, email: created.email },
            { status: 201 }
          );
        } catch (e) {
          console.error(e);
          return json({ error: "Failed to create user" }, { status: 500 });
        }
      },
    },
  },
});
