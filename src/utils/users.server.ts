import { createServerFn } from "@tanstack/react-start";
import axios from "redaxios";
import z from "zod";
import { User } from "./users";

export const getUsers = createServerFn({ method: "GET" })
  .inputValidator(z.object({ filter: z.string().optional() }))
  .handler(async ({ data }) => {
    const { data: userList } = await axios.get<Array<User>>(
      "https://jsonplaceholder.typicode.com/users"
    );
    if (data?.filter) {
      const query = data.filter.toLowerCase();
      return userList.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }
    return userList;
  });

export const getUser = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    console.info(`Fetching user with id ${data.userId}...`);
    const res = await axios.get<User>(
      `https://jsonplaceholder.typicode.com/users/${data.userId}`
    );
    return res.data;
  });

export const createUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
    })
  )
  .handler(async ({ data }) => {
    console.info(`Creating user ${data.name}...`);
    const res = await axios.post<User>(
      `https://jsonplaceholder.typicode.com/users`,
      {
        name: data.name,
        email: data.email,
      }
    );
    return res.data;
  });

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    })
  )
  .handler(async ({ data }) => {
    console.info(`Updating user ${data.userId}...`);
    const res = await axios.put<User>(
      `https://jsonplaceholder.typicode.com/users/${data.userId}`,
      {
        name: data.name,
        email: data.email,
      }
    );
    return res.data;
  });

export const deleteUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    console.info(`Deleting user ${data.userId}...`);
    await axios.delete(
      `https://jsonplaceholder.typicode.com/users/${data.userId}`
    );
    return { success: true };
  });
