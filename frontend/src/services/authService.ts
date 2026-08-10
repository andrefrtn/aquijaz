import { request } from "@/lib/api/client";
import type { User } from "@/types";

export async function signIn(email: string): Promise<User> {
  return request<User>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function signUp(name: string, email: string): Promise<User> {
  return request<User>("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify({ name, email }),
  });
}

export async function getCurrentUser(): Promise<User> {
  return request<User>("/user");
}
