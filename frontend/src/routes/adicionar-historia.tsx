import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input, SelectField, Textarea } from "@/components/common/Input";
import { ApiError } from "@/lib/api/client";
import { createStory, getPeople } from "@/services/peopleService";

export const Route = createFileRoute("/adicionar-historia")({
  validateSearch: (search: Record<string, unknown>) => ({
    pessoa: typeof search["pessoa"] === "string" ? search["pessoa"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Adicionar história — Aquijaz" },
      {
        name: "description",
        content: "Registre uma lembrança escrita no arquivo de memória de uma pessoa.",
      },
    ],
  }),
  component: AdicionarHistoriaPage,
});

function AdicionarHistoriaPage() {
  const { pessoa } = Route.useSearch();
  const navigate = useNavigate();
  const canFetch = typeof window !== "undefined";
  const peopleQuery = useQuery({
    queryKey: ["people", "todas"],
    queryFn: () => getPeople({ pageSize: 100 }),
    enabled: canFetch,
  });

  const [personId, setPersonId] = useState(pessoa);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [year, setYear] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!personId) nextErrors["personId"] = "Escolha a memória de destino.";
    if (title.trim().length < 3) nextErrors["title"] = "Informe um título.";
    if (content.trim().length < 20) nextErrors["content"] = "Escreva ao menos 20 caracteres.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await createStory({
        personId,
        title: title.trim(),
        content: content.trim(),
        ...(year.trim() ? { year: year.trim() } : {}),
      });
      toast.success("História adicionada ao arquivo.");
      void navigate({ to: "/memoria/$id", params: { id: personId } });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Não foi possível adicionar a história.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div>
          <p className="rule-label text-sage">Lembrança escrita</p>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">Adicionar história</h1>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">
            Conte um episódio, uma frase, um costume ou qualquer lembrança que ajude o arquivo a ficar mais vivo.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 border border-border bg-card p-6 md:p-10">
          <SelectField
            label="Memória de destino"
            required
            value={personId}
            onChange={(event) => setPersonId(event.target.value)}
            {...(errors["personId"] ? { error: errors["personId"] } : {})}
          >
            <option value="">Selecione uma memória</option>
            {peopleQuery.data?.items.map((person) => (
              <option key={person.id} value={person.id}>
                {person.knownAs ?? person.fullName}
              </option>
            ))}
          </SelectField>
          <Input
            label="Título"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            {...(errors["title"] ? { error: errors["title"] } : {})}
          />
          <Textarea
            label="História"
            required
            value={content}
            onChange={(event) => setContent(event.target.value)}
            hint="Escreva como você contaria essa lembrança para outra pessoa."
            {...(errors["content"] ? { error: errors["content"] } : {})}
          />
          <Input
            label="Ano ou período"
            placeholder="Ex.: 1984, anos 90, infância"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Enviando história..." : "Enviar história"}
          </Button>
        </form>
      </div>
    </div>
  );
}
