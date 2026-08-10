import { request } from "@/lib/api/client";
import type {
  Category,
  CreateMemoryInput,
  Paginated,
  Person,
  Photo,
  Story,
  UpdateMemoryInput,
  UploadPhotoInput,
} from "@/types";

export type SortOrder = "relevantes" | "recentes" | "antigos" | "az" | "za";

export interface PeopleQuery {
  search?: string;
  category?: Category | "Todas";
  decade?: string;
  sort?: SortOrder;
  page?: number;
  pageSize?: number;
}

export const DECADES = ["1910", "1920", "1930", "1940", "1950", "1960"];

function buildQuery(query: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params.toString() ? `?${params.toString()}` : "";
}

export async function getPeople(query: PeopleQuery = {}): Promise<Paginated<Person>> {
  return request<Paginated<Person>>(`/people${buildQuery(query)}`);
}

export async function getPersonById(id: string): Promise<Person> {
  return request<Person>(`/people/${encodeURIComponent(id)}`);
}

export async function getFeaturedPeople(): Promise<Person[]> {
  return request<Person[]>("/people/featured");
}

export async function getRecentPeople(limit = 4): Promise<Person[]> {
  return request<Person[]>(`/people/recent?limit=${limit}`);
}

export async function getPhotos(personId?: string): Promise<Photo[]> {
  return request<Photo[]>(personId ? `/photos?personId=${encodeURIComponent(personId)}` : "/photos");
}

export async function getStories(personId: string): Promise<Story[]> {
  return request<Story[]>(`/stories?personId=${encodeURIComponent(personId)}`);
}

export async function createMemory(input: CreateMemoryInput): Promise<Person> {
  return request<Person>("/people", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateMemory(id: string, input: UpdateMemoryInput): Promise<Person> {
  return request<Person>(`/people/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteMemory(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/people/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function toggleLikeMemory(id: string): Promise<{ person: Person; liked: boolean }> {
  return request<{ person: Person; liked: boolean }>(`/people/${encodeURIComponent(id)}/like`, {
    method: "POST",
  });
}

export async function uploadPhoto(input: UploadPhotoInput): Promise<Photo> {
  return request<Photo>("/photos", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
