# Aquijaz

Projeto separado em `backend` e `frontend`.

## Rodar o backend

```bash
npm --prefix backend run dev
```

O backend sobe em `http://localhost:3001` e expoe as rotas em `/api`.

## Rodar o frontend

Em outro terminal:

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

Se o frontend estiver rodando em outra porta, como `http://localhost:8080`, mantenha o backend aberto em `http://localhost:3001`. O frontend procura a API em `http://localhost:3001/api` por padrao.

Para trocar a URL da API:

```bash
VITE_API_URL=http://localhost:3001/api npm --prefix frontend run dev
```
