# Aquijaz

Projeto separado em `backend` e `frontend`.

## Rodar o backend

```bash
npm --prefix backend run dev
```

O backend sobe em `http://localhost:3001` e expõe as rotas em `/api`.

## Rodar o frontend

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

O frontend usa proxy para enviar `/api` ao backend.
