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
  authorId?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  likeCount?: number;
  likedBy?: string[];
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
  uploaderId?: string;
  uploaderName?: string;
  uploaderAvatarUrl?: string;
  createdAt: string;
}

export interface Story {
  id: string;
  personId: string;
  title: string;
  content: string;
  author: string;
  authorId?: string;
  authorAvatarUrl?: string;
  year?: string;
  replies?: StoryReply[];
  createdAt: string;
}

export interface StoryReply {
  id: string;
  content: string;
  author: string;
  authorId?: string;
  authorAvatarUrl?: string;
  parentReplyId?: string;
  targetAuthor?: string;
  targetAuthorId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  actorAvatarUrl?: string;
  type: "like" | "story" | "story_reply" | "reply";
  message: string;
  personId?: string;
  storyId?: string;
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  city?: string;
  memberSince: string;
  avatarUrl: string;
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

export type UpdateMemoryInput = CreateMemoryInput;

export interface UploadPhotoInput {
  personId: string;
  fileName: string;
  previewUrl?: string;
  description: string;
  approximateDate: string;
  location?: string;
  author?: string;
}

export interface CreateStoryInput {
  personId: string;
  title: string;
  content: string;
  year?: string;
}

export interface CreateStoryReplyInput {
  content: string;
  parentReplyId?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
