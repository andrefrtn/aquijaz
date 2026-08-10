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
  normalizeSocialFields(user);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.city ?? "",
    memberSince: user.memberSince,
    avatarUrl: user.avatarUrl || DEFAULT_AVATAR_URL,
    friends: user.friends,
    incomingFriendRequests: user.incomingFriendRequests,
    outgoingFriendRequests: user.outgoingFriendRequests,
  };
}

function publicProfile(user) {
  normalizeSocialFields(user);
  return {
    id: user.id,
    name: user.name,
    city: user.city ?? "",
    memberSince: user.memberSince,
    avatarUrl: user.avatarUrl || DEFAULT_AVATAR_URL,
    friends: user.friends,
  };
}

function normalizeSocialFields(user) {
  user.friends = Array.isArray(user.friends) ? user.friends : [];
  user.incomingFriendRequests = Array.isArray(user.incomingFriendRequests) ? user.incomingFriendRequests : [];
  user.outgoingFriendRequests = Array.isArray(user.outgoingFriendRequests) ? user.outgoingFriendRequests : [];
  return user;
}

export async function registerUser({ name, email, password, city = "", avatarUrl = "" }) {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCity = city.trim();

  if (users.some((user) => user.email === normalizedEmail)) {
    return { error: "Este e-mail já está cadastrado.", status: 409 };
  }

  if (normalizedCity.length < 2) {
    return { error: "Informe sua cidade.", status: 400 };
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    city: normalizedCity,
    memberSince: new Date().toISOString().slice(0, 10),
    avatarUrl: avatarUrl.trim() || DEFAULT_AVATAR_URL,
    friends: [],
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
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

export async function getPublicUserById(id) {
  const users = await readUsers();
  const user = users.find((item) => item.id === id);

  return user ? publicProfile(user) : null;
}

export async function requestFriendship(fromUserId, toUserId) {
  const users = await readUsers();
  const fromUser = users.find((item) => item.id === fromUserId);
  const toUser = users.find((item) => item.id === toUserId);

  if (!fromUser || !toUser) return { error: "Usuário não encontrado.", status: 404 };
  if (fromUser.id === toUser.id) return { error: "Você não pode adicionar a si mesmo.", status: 400 };

  normalizeSocialFields(fromUser);
  normalizeSocialFields(toUser);

  if (fromUser.friends.includes(toUser.id)) return { status: 200, profile: publicProfile(toUser), state: "friends" };
  if (fromUser.outgoingFriendRequests.includes(toUser.id)) {
    return { status: 200, profile: publicProfile(toUser), state: "pending" };
  }

  fromUser.outgoingFriendRequests.push(toUser.id);
  toUser.incomingFriendRequests.push(fromUser.id);
  await writeUsers(users);

  return { status: 201, profile: publicProfile(toUser), state: "pending" };
}

export async function acceptFriendship(currentUserId, requesterId) {
  const users = await readUsers();
  const currentUser = users.find((item) => item.id === currentUserId);
  const requester = users.find((item) => item.id === requesterId);

  if (!currentUser || !requester) return { error: "Usuário não encontrado.", status: 404 };

  normalizeSocialFields(currentUser);
  normalizeSocialFields(requester);

  if (!currentUser.incomingFriendRequests.includes(requester.id)) {
    return { error: "Solicitação não encontrada.", status: 404 };
  }

  currentUser.incomingFriendRequests = currentUser.incomingFriendRequests.filter((id) => id !== requester.id);
  requester.outgoingFriendRequests = requester.outgoingFriendRequests.filter((id) => id !== currentUser.id);
  if (!currentUser.friends.includes(requester.id)) currentUser.friends.push(requester.id);
  if (!requester.friends.includes(currentUser.id)) requester.friends.push(currentUser.id);

  await writeUsers(users);

  return { profile: publicProfile(requester) };
}

export async function removeFriendship(currentUserId, otherUserId) {
  const users = await readUsers();
  const currentUser = users.find((item) => item.id === currentUserId);
  const otherUser = users.find((item) => item.id === otherUserId);

  if (!currentUser || !otherUser) return { error: "Usuário não encontrado.", status: 404 };

  normalizeSocialFields(currentUser);
  normalizeSocialFields(otherUser);

  currentUser.friends = currentUser.friends.filter((id) => id !== otherUser.id);
  otherUser.friends = otherUser.friends.filter((id) => id !== currentUser.id);
  currentUser.incomingFriendRequests = currentUser.incomingFriendRequests.filter((id) => id !== otherUser.id);
  currentUser.outgoingFriendRequests = currentUser.outgoingFriendRequests.filter((id) => id !== otherUser.id);
  otherUser.incomingFriendRequests = otherUser.incomingFriendRequests.filter((id) => id !== currentUser.id);
  otherUser.outgoingFriendRequests = otherUser.outgoingFriendRequests.filter((id) => id !== currentUser.id);

  await writeUsers(users);

  return { profile: publicProfile(otherUser) };
}
