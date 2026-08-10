import http from "node:http";
import { people, photos, stories, user } from "./data.js";

const PORT = Number(process.env.PORT ?? 3001);

function send(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
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

function sortPeople(list, sort = "recentes") {
  const sorted = [...list];
  if (sort === "antigos") return sorted.sort((a, b) => a.birthDate.localeCompare(b.birthDate));
  if (sort === "az") return sorted.sort((a, b) => a.fullName.localeCompare(b.fullName, "pt-BR"));
  if (sort === "za") return sorted.sort((a, b) => b.fullName.localeCompare(a.fullName, "pt-BR"));
  return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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

function createMemory(input) {
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
    coverPhotoUrl:
      input.coverPhotoUrl ??
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&h=1200&q=80",
    createdAt: new Date().toISOString().slice(0, 10)
  };
  people.unshift(person);
  return person;
}

function createPhoto(input) {
  const photo = {
    id: `${input.personId}-photo-${Date.now().toString(36)}`,
    personId: input.personId,
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&h=1250&q=80",
    description: input.description,
    approximateDate: input.approximateDate,
    ...(input.location ? { location: input.location } : {}),
    ...(input.author ? { author: input.author } : {}),
    createdAt: new Date().toISOString().slice(0, 10)
  };
  photos.unshift(photo);
  return photo;
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

    if (req.method === "GET" && path === "/api/people") {
      const page = Number(url.searchParams.get("page") ?? 1);
      const pageSize = Number(url.searchParams.get("pageSize") ?? 9);
      const filtered = sortPeople(
        people.filter((person) => matches(person, url.searchParams)),
        url.searchParams.get("sort") ?? "recentes"
      );
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);
      send(res, 200, {
        items,
        total: filtered.length,
        page,
        pageSize,
        hasMore: start + items.length < filtered.length
      });
      return;
    }

    if (req.method === "GET" && path === "/api/people/featured") {
      send(res, 200, people.filter((person) => person.featured).slice(0, 4));
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
        send(res, 404, { message: "Memoria nao encontrada" });
        return;
      }
      send(res, 200, person);
      return;
    }

    if (req.method === "POST" && path === "/api/people") {
      const body = await readBody(req);
      send(res, 201, createMemory(body));
      return;
    }

    if (req.method === "GET" && path === "/api/photos") {
      const personId = url.searchParams.get("personId");
      send(res, 200, personId ? photos.filter((photo) => photo.personId === personId) : photos);
      return;
    }

    if (req.method === "POST" && path === "/api/photos") {
      const body = await readBody(req);
      send(res, 201, createPhoto(body));
      return;
    }

    if (req.method === "GET" && path === "/api/stories") {
      const personId = url.searchParams.get("personId");
      send(res, 200, personId ? stories.filter((story) => story.personId === personId) : stories);
      return;
    }

    if (req.method === "GET" && path === "/api/user") {
      send(res, 200, user);
      return;
    }

    if (req.method === "POST" && path === "/api/auth/sign-in") {
      const body = await readBody(req);
      send(res, 200, { ...user, email: body.email ?? user.email });
      return;
    }

    if (req.method === "POST" && path === "/api/auth/sign-up") {
      const body = await readBody(req);
      send(res, 201, { ...user, name: body.name ?? user.name, email: body.email ?? user.email });
      return;
    }

    send(res, 404, { message: "Rota nao encontrada" });
  } catch (error) {
    send(res, 500, { message: error instanceof Error ? error.message : "Erro interno" });
  }
});

server.listen(PORT, () => {
  console.log(`Aquijaz backend rodando em http://localhost:${PORT}`);
});
