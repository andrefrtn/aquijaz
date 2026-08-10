import { request } from "@/lib/api/client";
import type { User } from "@/types";

const TOKEN_KEY = "aquijaz_token";

interface LoginResponse {
  token: string;
  user: User;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("aquijaz-auth-changed"));
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("aquijaz-auth-changed"));
}

export async function signIn(email: string, password: string): Promise<User> {
  const response = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setToken(response.token);
  return response.user;
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  city = "",
  avatarUrl = "",
): Promise<User> {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, city, avatarUrl }),
  });
}

export async function getCurrentUser(): Promise<User> {
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  return request<User>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function logout(): Promise<void> {
  const token = getToken();

  if (token) {
    try {
      await request("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } finally {
      clearToken();
    }
    return;
  }

  clearToken();
}
