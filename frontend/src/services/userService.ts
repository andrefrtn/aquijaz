import { request } from "@/lib/api/client";
import type { PublicUserProfile } from "@/types";

export async function getPublicUserProfile(id: string): Promise<PublicUserProfile> {
  return request<PublicUserProfile>(`/users/${encodeURIComponent(id)}`);
}

export async function requestFriendship(id: string): Promise<{ profile: PublicUserProfile; state: string }> {
  return request<{ profile: PublicUserProfile; state: string }>(`/users/${encodeURIComponent(id)}/friend-request`, {
    method: "POST",
  });
}

export async function acceptFriendship(id: string): Promise<PublicUserProfile> {
  return request<PublicUserProfile>(`/users/${encodeURIComponent(id)}/friend-accept`, {
    method: "POST",
  });
}

export async function removeFriendship(id: string): Promise<PublicUserProfile> {
  return request<PublicUserProfile>(`/users/${encodeURIComponent(id)}/friend-remove`, {
    method: "POST",
  });
}
