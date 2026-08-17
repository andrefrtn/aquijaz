import crypto from "node:crypto";
import { DEFAULT_AVATAR_URL } from "./data.js";
import { supabase } from "./supabase.js";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "aquijaz-dev-secret";
}

function signPayload(payload) {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function createSessionToken(userId) {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      expiresAt: Date.now() + SESSION_TTL_MS,
    }),
  ).toString("base64url");

  return `${payload}.${signPayload(payload)}`;
}

function readSessionToken(token) {
  if (!token || !token.includes(".")) return null;

  const [payload, signature] = token.split(".");
  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.userId || Number(session.expiresAt) < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
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

function toAppUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.city ?? "",
    memberSince: user.member_since,
    avatarUrl: user.avatar_url || DEFAULT_AVATAR_URL,
    friends: user.friends ?? [],
    incomingFriendRequests: user.incoming_friend_requests ?? [],
    outgoingFriendRequests: user.outgoing_friend_requests ?? [],
  };
}

function publicUser(user) {
  const appUser = toAppUser(user);

  return {
    id: appUser.id,
    name: appUser.name,
    email: appUser.email,
    city: appUser.city,
    memberSince: appUser.memberSince,
    avatarUrl: appUser.avatarUrl,
    friends: appUser.friends,
    incomingFriendRequests: appUser.incomingFriendRequests,
    outgoingFriendRequests: appUser.outgoingFriendRequests,
  };
}

function publicProfile(user) {
  const appUser = toAppUser(user);

  return {
    id: appUser.id,
    name: appUser.name,
    city: appUser.city,
    memberSince: appUser.memberSince,
    avatarUrl: appUser.avatarUrl,
    friends: appUser.friends,
  };
}

async function findUserById(id) {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data;
}

async function findUserByEmail(email) {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).maybeSingle();

  if (error) throw error;
  return data;
}

async function updateUser(id, patch) {
  const { data, error } = await supabase.from("users").update(patch).eq("id", id).select("*").single();

  if (error) throw error;
  return data;
}

export async function registerUser({ name, email, password, city = "", avatarUrl = "" }) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCity = city.trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    return { error: "Este e-mail já está cadastrado.", status: 409 };
  }

  if (normalizedCity.length < 2) {
    return { error: "Informe sua cidade.", status: 400 };
  }

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name: name.trim(),
      email: normalizedEmail,
      password_hash: hashPassword(password),
      city: normalizedCity,
      member_since: new Date().toISOString().slice(0, 10),
      avatar_url: avatarUrl.trim() || DEFAULT_AVATAR_URL,
      friends: [],
      incoming_friend_requests: [],
      outgoing_friend_requests: [],
    })
    .select("*")
    .single();

  if (error) {
    return { error: error.message, status: 500 };
  }

  return { user: publicUser(user) };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "E-mail ou senha inválidos.", status: 401 };
  }

  const token = createSessionToken(user.id);

  return { token, user: publicUser(user) };
}

export async function getUserByToken(token) {
  const session = readSessionToken(token);
  if (!session) return null;

  const user = await findUserById(session.userId);

  return user ? publicUser(user) : null;
}

export function logoutUser(token) {
  return Boolean(token);
}

export async function getPublicUserById(id) {
  const user = await findUserById(id);

  return user ? publicProfile(user) : null;
}

export async function requestFriendship(fromUserId, toUserId) {
  const fromUser = await findUserById(fromUserId);
  const toUser = await findUserById(toUserId);

  if (!fromUser || !toUser) return { error: "Usuário não encontrado.", status: 404 };
  if (fromUser.id === toUser.id) return { error: "Você não pode adicionar a si mesmo.", status: 400 };

  const fromOutgoing = fromUser.outgoing_friend_requests ?? [];
  const fromFriends = fromUser.friends ?? [];
  const toIncoming = toUser.incoming_friend_requests ?? [];

  if (fromFriends.includes(toUser.id)) return { status: 200, profile: publicProfile(toUser), state: "friends" };
  if (fromOutgoing.includes(toUser.id)) {
    return { status: 200, profile: publicProfile(toUser), state: "pending" };
  }

  const updatedToUser = await updateUser(toUser.id, {
    incoming_friend_requests: [...toIncoming, fromUser.id],
  });

  await updateUser(fromUser.id, {
    outgoing_friend_requests: [...fromOutgoing, toUser.id],
  });

  return { status: 201, profile: publicProfile(updatedToUser), state: "pending" };
}

export async function acceptFriendship(currentUserId, requesterId) {
  const currentUser = await findUserById(currentUserId);
  const requester = await findUserById(requesterId);

  if (!currentUser || !requester) return { error: "Usuário não encontrado.", status: 404 };

  const incoming = currentUser.incoming_friend_requests ?? [];
  const requesterOutgoing = requester.outgoing_friend_requests ?? [];
  const currentFriends = currentUser.friends ?? [];
  const requesterFriends = requester.friends ?? [];

  if (!incoming.includes(requester.id)) {
    return { error: "Solicitação não encontrada.", status: 404 };
  }

  await updateUser(currentUser.id, {
    incoming_friend_requests: incoming.filter((id) => id !== requester.id),
    friends: currentFriends.includes(requester.id) ? currentFriends : [...currentFriends, requester.id],
  });

  const updatedRequester = await updateUser(requester.id, {
    outgoing_friend_requests: requesterOutgoing.filter((id) => id !== currentUser.id),
    friends: requesterFriends.includes(currentUser.id) ? requesterFriends : [...requesterFriends, currentUser.id],
  });

  return { profile: publicProfile(updatedRequester) };
}

export async function removeFriendship(currentUserId, otherUserId) {
  const currentUser = await findUserById(currentUserId);
  const otherUser = await findUserById(otherUserId);

  if (!currentUser || !otherUser) return { error: "Usuário não encontrado.", status: 404 };

  const updatedOtherUser = await updateUser(otherUser.id, {
    friends: (otherUser.friends ?? []).filter((id) => id !== currentUser.id),
    incoming_friend_requests: (otherUser.incoming_friend_requests ?? []).filter((id) => id !== currentUser.id),
    outgoing_friend_requests: (otherUser.outgoing_friend_requests ?? []).filter((id) => id !== currentUser.id),
  });

  await updateUser(currentUser.id, {
    friends: (currentUser.friends ?? []).filter((id) => id !== otherUser.id),
    incoming_friend_requests: (currentUser.incoming_friend_requests ?? []).filter((id) => id !== otherUser.id),
    outgoing_friend_requests: (currentUser.outgoing_friend_requests ?? []).filter((id) => id !== otherUser.id),
  });

  return { profile: publicProfile(updatedOtherUser) };
}
