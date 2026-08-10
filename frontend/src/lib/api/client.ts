export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("aquijaz_token");
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Falha na requisição: ${path}`;

    try {
      const payload = (await response.clone().json()) as { message?: unknown };
      if (typeof payload.message === "string") message = payload.message;
    } catch {
      message = `Falha na requisição: ${path}`;
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}
