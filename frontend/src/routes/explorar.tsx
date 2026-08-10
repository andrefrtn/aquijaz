import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { SelectField } from "@/components/common/Input";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PersonCard } from "@/components/PersonCard";
import { SearchBar } from "@/components/SearchBar";
import { DECADES, getPeople, type SortOrder } from "@/services/peopleService";
import type { Category } from "@/types";

export const Route = createFileRoute("/explorar")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    categoria: typeof search["categoria"] === "string" ? search["categoria"] : "Todas",
  }),
  head: () => ({
    meta: [
      { title: "Explorar memórias — Aquijaz" },
      {
        name: "description",
        content:
          "Busque por nome, filtre por categoria e período e percorra o arquivo de memórias do Aquijaz.",
      },
      { property: "og:title", content: "Explorar memórias — Aquijaz" },
      {
        property: "og:description",
        content: "Busque por nome, filtre por categoria e período e percorra o arquivo.",
      },
    ],
  }),
  component: ExplorarPage,
});

const PAGE_SIZE = 6;

function ExplorarPage() {
  const { q, categoria } = Route.useSearch();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | "Todas">(categoria as Category | "Todas");
  const [decade, setDecade] = useState("Todos");
  const [sort, setSort] = useState<SortOrder>("relevantes");
  const [page, setPage] = useState(1);
  const canFetch = typeof window !== "undefined";

  const query = useQuery({
    queryKey: ["people", q, category, decade, sort, page],
    queryFn: () =>
      getPeople({ search: q, category, decade, sort, page: 1, pageSize: page * PAGE_SIZE }),
    enabled: canFetch,
  });

  const items = query.data?.items ?? [];

  function resetAndSearch(term: string) {
    setPage(1);
    void navigate({ to: "/explorar", search: { q: term } });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-10 md:py-12">
      <p className="rule-label text-sage">Arquivo</p>
      <h1 className="font-display mt-2 text-4xl leading-tight md:text-5xl">Explorar memórias</h1>
      <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
        Percorra o arquivo por nome, categoria ou período. Cada ficha reúne fotografias e histórias
        enviadas por quem conviveu com aquela pessoa.
      </p>

      <div className="mt-6 max-w-2xl">
        <SearchBar defaultValue={q} onSearch={resetAndSearch} />
      </div>

      <div className="mt-6 flex flex-col gap-4 border-y border-border py-4">
        <CategoryFilter
          value={category}
          onChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <SelectField
            label="Período de nascimento"
            value={decade}
            onChange={(event) => {
              setDecade(event.target.value);
              setPage(1);
            }}
          >
            <option value="Todos">Todos os períodos</option>
            {DECADES.map((item) => (
              <option key={item} value={item}>
                Década de {item}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Ordenar por"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as SortOrder);
              setPage(1);
            }}
          >
            <option value="relevantes">Mais curtidas</option>
            <option value="recentes">Adicionadas recentemente</option>
            <option value="antigos">Nascimento mais antigo</option>
            <option value="az">Nome (A–Z)</option>
            <option value="za">Nome (Z–A)</option>
          </SelectField>
        </div>
      </div>

      <div className="mt-8">
        {query.isPending ? (
          <LoadingState count={6} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Nenhuma memória encontrada"
            description="Tente outro nome, remova os filtros ou seja a primeira pessoa a criar este arquivo."
          />
        ) : (
          <>
            <p className="rule-label mb-6 text-muted-foreground">
              {query.data?.total} memórias no arquivo
            </p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
            {query.data?.hasMore ? (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  disabled={query.isFetching}
                  onClick={() => setPage((value) => value + 1)}
                >
                  {query.isFetching ? "Carregando…" : "Carregar mais memórias"}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
