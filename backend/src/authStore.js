import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_AVATAR_URL } from "./data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../data/users.json");
const sessions = new Map();

async function ensureDb() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, "[]", "utf8");
  }
}

async function readUsers() {
  await ensureDb();
  return JSON.parse(await fs.readFile(DB_PATH, "utf8"));
}

async function writeUsers(users) {
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2), "utf8");
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const next = hashPassword(password, salt).split(":")[1];
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(next));
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.city ?? "",
    memberSince: user.memberSince,
    avatarUrl: user.avatarUrl || DEFAULT_AVATAR_URL,
  };
}

export async function registerUser({ name, email, password, city = "", avatarUrl = "" }) {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    return { error: "Este e-mail já está cadastrado.", status: 409 };
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    city: city.trim(),
    memberSince: new Date().toISOString().slice(0, 10),
    avatarUrl: avatarUrl.trim() || DEFAULT_AVATAR_URL,
  };

  users.push(user);
  await writeUsers(users);

  return { user: publicUser(user) };
}

export async function loginUser({ email, password }) {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-mail ou senha inválidos.", status: 401 };
  }

  const token = crypto.randomUUID();
  sessions.set(token, user.id);

  return { token, user: publicUser(user) };
}

export async function getUserByToken(token) {
  if (!token || !sessions.has(token)) return null;

  const users = await readUsers();
  const userId = sessions.get(token);
  const user = users.find((item) => item.id === userId);

  return user ? publicUser(user) : null;
}

export function logoutUser(token) {
  sessions.delete(token);
}
