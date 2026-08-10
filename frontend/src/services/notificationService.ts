import { request } from "@/lib/api/client";
import type { Notification } from "@/types";

export async function getNotifications(): Promise<Notification[]> {
  return request<Notification[]>("/notifications");
}

export async function markNotificationsRead(): Promise<void> {
  await request<{ ok: boolean }>("/notifications/read", {
    method: "POST",
  });
}
