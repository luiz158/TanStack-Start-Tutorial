import { queryOptions } from "@tanstack/react-query";
import { getUser, getUsers } from "./users.server";

export type User = {
  id: number;
  name: string;
  email: string;
};

export const usersQueryOptions = (filter?: string) => {
  return queryOptions({
    queryKey: ['users', { filter: filter || '' }],
    queryFn: () => getUsers({ data: { filter } }),
  });
};

export const userQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['user', { userId }],
    queryFn: () => getUser({ data: { userId } }),
  });
};
