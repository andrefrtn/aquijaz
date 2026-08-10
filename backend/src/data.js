import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = path.resolve(__dirname, "../data/content.json");

export const DEFAULT_AVATAR_URL =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80";

export const DEFAULT_MEMORY_PHOTO_URL =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&h=1200&q=80";

export const DEFAULT_GALLERY_PHOTO_URL =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&h=1250&q=80";

export const people = [];

export const photos = [];

export const stories = [];

export const notifications = [];

async function ensureContentDb() {
  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  try {
    await fs.access(CONTENT_PATH);
  } catch {
    await fs.writeFile(
      CONTENT_PATH,
      JSON.stringify({ people: [], photos: [], stories: [], notifications: [] }, null, 2),
      "utf8",
    );
  }
}

export async function loadContent() {
  await ensureContentDb();
  const content = JSON.parse(await fs.readFile(CONTENT_PATH, "utf8"));

  people.splice(0, people.length, ...(content.people ?? []));
  photos.splice(0, photos.length, ...(content.photos ?? []));
  stories.splice(0, stories.length, ...(content.stories ?? []));
  notifications.splice(0, notifications.length, ...(content.notifications ?? []));
}

export async function saveContent() {
  await ensureContentDb();
  await fs.writeFile(CONTENT_PATH, JSON.stringify({ people, photos, stories, notifications }, null, 2), "utf8");
}
