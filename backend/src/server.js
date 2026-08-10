import http from "node:http";
import {
  DEFAULT_GALLERY_PHOTO_URL,
  DEFAULT_MEMORY_PHOTO_URL,
  loadContent,
  people,
  photos,
  saveContent,
  stories,
} from "./data.js";
import { getUserByToken, loginUser, logoutUser, registerUser } from "./authStore.js";

const PORT = Number(process.env.PORT ?? 3001);

function send(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function requireAuth(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = await getUserByToken(token);

  if (!user) {
    send(res, 401, { message: "Você precisa estar logado para continuar." });
    return null;
  }

  return user;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function decadeOf(date) {
  return `${Math.floor(new Date(date).getFullYear() / 10) * 10}`;
}

function comparable(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getLikeCount(person) {
  return Array.isArray(person.likedBy) ? person.likedBy.length : Number(person.likeCount ?? 0);
}

function sortPeople(list, sort = "relevantes") {
  const sorted = [...list];
  if (sort === "antigos") return sorted.sort((a, b) => a.birthDate.localeCompare(b.birthDate));
  if (sort === "az") return sorted.sort((a, b) => a.fullName.localeCompare(b.fullName, "pt-BR"));
  if (sort === "za") return sorted.sort((a, b) => b.fullName.localeCompare(a.fullName, "pt-BR"));
  if (sort === "recentes") return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sortByRelevance(sorted);
}

function sortByRelevance(list) {
  return [...list].sort((a, b) => {
    const likes = getLikeCount(b) - getLikeCount(a);
    if (likes !== 0) return likes;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

function matches(person, params) {
  const term = params.get("search")?.trim().toLowerCase();
  const category = params.get("category");
  const decade = params.get("decade");

  if (term) {
    const haystack = `${person.fullName} ${person.knownAs ?? ""} ${person.city} ${person.country}`.toLowerCase();
    if (!haystack.includes(term)) return false;
  }

  if (category && category !== "Todas" && comparable(person.category) !== comparable(category)) return false;
  if (decade && decade !== "Todos" && decadeOf(person.birthDate) !== decade) return false;
  return true;
}

async function createMemory(input, author) {
  const baseId = slugify(input.fullName);
  const person = {
    id: `${baseId}-${Date.now().toString(36)}`,
    fullName: input.fullName,
    ...(input.knownAs ? { knownAs: input.knownAs } : {}),
    birthDate: input.birthDate,
    ...(input.deathDate ? { deathDate: input.deathDate } : {}),
    biography: input.biography,
    city: input.city,
    country: input.country,
    category: input.category,
    coverPhotoUrl: input.coverPhotoUrl ?? DEFAULT_MEMORY_PHOTO_URL,
    authorId: author.id,
    authorName: author.name,
    authorAvatarUrl: author.avatarUrl,
    likeCount: 0,
    likedBy: [],
    createdAt: new Date().toISOString().slice(0, 10),
  };

  people.unshift(person);
  await saveContent();
  return person;
}

async function createPhoto(input, uploader) {
  const photo = {
    id: `${input.personId}-photo-${Date.now().toString(36)}`,
    personId: input.personId,
    url: input.previewUrl ?? DEFAULT_GALLERY_PHOTO_URL,
    description: input.description,
    approximateDate: input.approximateDate,
    ...(input.location ? { location: input.location } : {}),
    ...(input.author ? { author: input.author } : {}),
    uploaderId: uploader.id,
    uploaderName: uploader.name,
    uploaderAvatarUrl: uploader.avatarUrl,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  photos.unshift(photo);
  await saveContent();
  return photo;
}

async function updateMemory(id, input, user) {
  const index = people.findIndex((item) => item.id === id);

  if (index < 0) return { status: 404, error: "Memória não encontrada." };
  if (people[index].authorId !== user.id) return { status: 403, error: "Você só pode editar seus próprios posts." };

  const updated = {
    ...people[index],
    fullName: input.fullName,
    ...(input.knownAs ? { knownAs: input.knownAs } : { knownAs: undefined }),
    birthDate: input.birthDate,
    ...(input.deathDate ? { deathDate: input.deathDate } : { deathDate: undefined }),
    biography: input.biography,
    city: input.city,
    country: input.country,
    category: input.category,
    coverPhotoUrl: input.coverPhotoUrl ?? people[index].coverPhotoUrl,
  };

  Object.keys(updated).forEach((key) => {
    if (updated[key] === undefined) delete updated[key];
  });

  people[index] = updated;
  await saveContent();
  return { person: updated };
}

async function deleteMemory(id, user) {
  const index = people.findIndex((item) => item.id === id);

  if (index < 0) return { status: 404, error: "Memória não encontrada." };
  if (people[index].authorId !== user.id) return { status: 403, error: "Você só pode apagar seus próprios posts." };

  people.splice(index, 1);

  for (let photoIndex = photos.length - 1; photoIndex >= 0; photoIndex--) {
    if (photos[photoIndex].personId === id) photos.splice(photoIndex, 1);
  }

  for (let storyIndex = stories.length - 1; storyIndex >= 0; storyIndex--) {
    if (stories[storyIndex].personId === id) stories.splice(storyIndex, 1);
  }

  await saveContent();
  return { ok: true };
}

async function toggleLike(id, user) {
  const person = people.find((item) => item.id === id);

  if (!person) return { status: 404, error: "Memória não encontrada." };

  const likedBy = Array.isArray(person.likedBy) ? person.likedBy : [];
  const alreadyLiked = likedBy.includes(user.id);
  person.likedBy = alreadyLiked ? likedBy.filter((userId) => userId !== user.id) : [...likedBy, user.id];
  person.likeCount = person.likedBy.length;

  await saveContent();
  return { person, liked: !alreadyLiked };
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      send(res, 204, {});
      return;
    }

    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const path = url.pathname;

    if (req.method === "GET" && path === "/api/health") {
      send(res, 200, { ok: true, service: "aquijaz-backend" });
      return;
    }

    if (req.method === "POST" && path === "/api/auth/register") {
      const body = await readBody(req);
      const result = await registerUser(body);

      if (result.error) {
        send(res, result.status, { message: result.error });
        return;
      }

      send(res, 201, result.user);
      return;
    }

    if (req.method === "POST" && path === "/api/auth/login") {
      const body = await readBody(req);
      const result = await loginUser(body);

      if (result.error) {
        send(res, result.status, { message: result.error });
        return;
      }

      send(res, 200, result);
      return;
    }

    if (req.method === "GET" && path === "/api/auth/me") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const user = await getUserByToken(token);

      if (!user) {
        send(res, 401, { message: "Sessão inválida ou expirada." });
        return;
      }

      send(res, 200, user);
      return;
    }

    if (req.method === "POST" && path === "/api/auth/logout") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      logoutUser(token);
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && path === "/api/people") {
      const page = Number(url.searchParams.get("page") ?? 1);
      const pageSize = Number(url.searchParams.get("pageSize") ?? 9);
      const filtered = sortPeople(
        people.filter((person) => matches(person, url.searchParams)),
        url.searchParams.get("sort") ?? "relevantes",
      );
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);

      send(res, 200, {
        items,
        total: filtered.length,
        page,
        pageSize,
        hasMore: start + items.length < filtered.length,
      });
      return;
    }

    if (req.method === "GET" && path === "/api/people/featured") {
      send(res, 200, sortByRelevance(people).slice(0, 4));
      return;
    }

    if (req.method === "GET" && path === "/api/people/recent") {
      const limit = Number(url.searchParams.get("limit") ?? 4);
      send(res, 200, sortPeople(people, "recentes").slice(0, limit));
      return;
    }

    if (req.method === "GET" && path.startsWith("/api/people/")) {
      const id = decodeURIComponent(path.split("/").at(-1) ?? "");
      const person = people.find((item) => item.id === id);

      if (!person) {
        send(res, 404, { message: "Memória não encontrada." });
        return;
      }

      send(res, 200, person);
      return;
    }

    if (req.method === "POST" && path === "/api/people") {
      const user = await requireAuth(req, res);
      if (!user) return;

      const body = await readBody(req);
      send(res, 201, await createMemory(body, user));
      return;
    }

    if (req.method === "POST" && path.startsWith("/api/people/") && path.endsWith("/like")) {
      const user = await requireAuth(req, res);
      if (!user) return;

      const id = decodeURIComponent(path.split("/").at(-2) ?? "");
      const result = await toggleLike(id, user);

      if (result.error) {
        send(res, result.status, { message: result.error });
        return;
      }

      send(res, 200, { person: result.person, liked: result.liked });
      return;
    }

    if ((req.method === "PUT" || req.method === "DELETE") && path.startsWith("/api/people/")) {
      const user = await requireAuth(req, res);
      if (!user) return;

      const id = decodeURIComponent(path.split("/").at(-1) ?? "");

      if (req.method === "PUT") {
        const body = await readBody(req);
        const result = await updateMemory(id, body, user);

        if (result.error) {
          send(res, result.status, { message: result.error });
          return;
        }

        send(res, 200, result.person);
        return;
      }

      const result = await deleteMemory(id, user);

      if (result.error) {
        send(res, result.status, { message: result.error });
        return;
      }

      send(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && path === "/api/photos") {
      const personId = url.searchParams.get("personId");
      send(res, 200, personId ? photos.filter((photo) => photo.personId === personId) : photos);
      return;
    }

    if (req.method === "POST" && path === "/api/photos") {
      const user = await requireAuth(req, res);
      if (!user) return;

      const body = await readBody(req);
      send(res, 201, await createPhoto(body, user));
      return;
    }

    if (req.method === "GET" && path === "/api/stories") {
      const personId = url.searchParams.get("personId");
      send(res, 200, personId ? stories.filter((story) => story.personId === personId) : stories);
      return;
    }

    send(res, 404, { message: "Rota não encontrada." });
  } catch (error) {
    send(res, 500, { message: error instanceof Error ? error.message : "Erro interno." });
  }
});

await loadContent();

server.listen(PORT, () => {
  console.log(`Aquijaz backend rodando em http://localhost:${PORT}`);
});
