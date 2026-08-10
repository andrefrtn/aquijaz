import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input, SelectField, Textarea } from "@/components/common/Input";
import { UploadArea } from "@/components/UploadArea";
import { getPeople, uploadPhoto } from "@/services/peopleService";

export const Route = createFileRoute("/adicionar-foto")({
  validateSearch: (search: Record<string, unknown>) => ({
    pessoa: typeof search["pessoa"] === "string" ? search["pessoa"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Adicionar fotografia — Aquijaz" },
      {
        name: "description",
        content:
          "Envie uma fotografia para o arquivo de alguém, com descrição, data aproximada, local e autoria.",
      },
      { property: "og:title", content: "Adicionar fotografia — Aquijaz" },
      {
        property: "og:description",
        content: "Envie uma fotografia com descrição, data aproximada, local e autoria.",
      },
    ],
  }),
  component: AdicionarFotoPage,
});

function AdicionarFotoPage() {
  const { pessoa } = Route.useSearch();
  const navigate = useNavigate();
  const peopleQuery = useQuery({
    queryKey: ["people", "todas"],
    queryFn: () => getPeople({ pageSize: 100 }),
  });

  const [personId, setPersonId] = useState(pessoa);
  const [fileName, setFileName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [approximateDate, setApproximateDate] = useState("");
  const [location, setLocation] = useState("");
  const [author, setAuthor] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!personId) nextErrors["personId"] = "Escolha a memória de destino.";
    if (!fileName) nextErrors["file"] = "Selecione uma fotografia.";
    if (description.trim().length < 15) {
      nextErrors["description"] = "Descreva a fotografia em ao menos 15 caracteres.";
    }
    if (!approximateDate.trim()) nextErrors["approximateDate"] = "Informe uma data aproximada.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await uploadPhoto({
        personId,
        fileName: fileName as string,
        description: description.trim(),
        approximateDate: approximateDate.trim(),
        ...(location.trim() ? { location: location.trim() } : {}),
        ...(author.trim() ? { author: author.trim() } : {}),
      });
      toast.success("Fotografia adicionada ao arquivo.");
      void navigate({ to: "/memoria/$id", params: { id: personId } });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        <div>
          <p className="rule-label text-sage">Contribuição</p>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
            Adicionar uma fotografia
          </h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">
            Quanto mais contexto você registrar — data aproximada, local, quem fez a foto — mais
            útil a imagem se torna para quem vier depois.
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
          <UploadArea
            onFileSelected={(name) => setFileName(name)}
            {...(errors["file"] ? { error: errors["file"] } : {})}
          />
          <Textarea
            label="Descrição da fotografia"
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            hint="Quem aparece, o que estava acontecendo, onde a imagem estava guardada."
            {...(errors["description"] ? { error: errors["description"] } : {})}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Data aproximada"
              required
              placeholder="Ex.: década de 1960"
              value={approximateDate}
              onChange={(event) => setApproximateDate(event.target.value)}
              {...(errors["approximateDate"] ? { error: errors["approximateDate"] } : {})}
            />
            <Input
              label="Local"
              placeholder="Ex.: casa da rua do Sol, Recife"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
          <Input
            label="Autor da fotografia"
            placeholder="Se não souber, deixe em branco"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Enviando fotografia…" : "Enviar fotografia"}
          </Button>
        </form>
      </div>
    </div>
  );
}