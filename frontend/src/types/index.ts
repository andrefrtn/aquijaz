export type Category =
  | "Música"
  | "Cinema"
  | "Literatura"
  | "Arte"
  | "Esporte"
  | "História"
  | "Família"
  | "Outras";

export const CATEGORIES: Category[] = [
  "Música",
  "Cinema",
  "Literatura",
  "Arte",
  "Esporte",
  "História",
  "Família",
  "Outras",
];

export interface Person {
  id: string;
  fullName: string;
  knownAs?: string;
  birthDate: string;
  deathDate?: string;
  biography: string;
  city: string;
  country: string;
  category: Category;
  coverPhotoUrl: string;
  featured?: boolean;
  createdAt: string;
}

export interface Photo {
  id: string;
  personId: string;
  url: string;
  description: string;
  approximateDate: string;
  location?: string;
  author?: string;
  createdAt: string;
}

export interface Story {
  id: string;
  personId: string;
  title: string;
  content: string;
  author: string;
  year?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  city?: string;
  memberSince: string;
  avatarUrl?: string;
}

export interface CreateMemoryInput {
  fullName: string;
  knownAs?: string;
  birthDate: string;
  deathDate?: string;
  biography: string;
  city: string;
  country: string;
  category: Category;
  coverPhotoUrl?: string;
}

export interface UploadPhotoInput {
  personId: string;
  fileName: string;
  description: string;
  approximateDate: string;
  location?: string;
  author?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}