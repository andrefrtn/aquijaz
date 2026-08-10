import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { Input, SelectField, Textarea } from "@/components/common/Input";
import { LoadingState } from "@/components/common/LoadingState";
import { UploadArea } from "@/components/UploadArea";
import { ApiError } from "@/lib/api/client";
import { getPersonById, updateMemory } from "@/services/peopleService";
import { CATEGORIES, type Category } from "@/types";

export const Route = createFileRoute("/editar-memoria/$id")({
  head: () => ({
    meta: [
      { title: "Editar memória — Aquijaz" },
      { name: "description", content: "Edite uma memória criada por você no Aquijaz." },
    ],
  }),
  component: EditarMemoriaPage,
});

interface FormState {
  fullName: string;
  knownAs: string;
  birthDate: string;
  deathDate: string;
  biography: string;
  city: string;
  country: string;
  category: Category | "";
}

const initialState: FormState = {
  fullName: "",
  knownAs: "",
  birthDate: "",
  deathDate: "",
  biography: "",
  city: "",
  country: "Brasil",
  category: "",
};

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (form.fullName.trim().length < 3) errors.fullName = "Informe o nome completo.";
  if (!form.birthDate) errors.birthDate = "Informe a data de nascimento.";
  if (form.deathDate && form.deathDate < form.birthDate) {
    errors.deathDate = "A data de falecimento deve ser posterior ao nascimento.";
  }
  if (form.biography.trim().length < 40) {
    errors.biography = "Escreva ao menos 40 caracteres sobre esta pessoa.";
  }
  if (!form.city.trim()) errors.city = "Informe a cidade.";
  if (!form.country.trim()) errors.country = "Informe o país.";
  if (!form.category) errors.category = "Escolha uma categoria.";
  return errors;
}

function EditarMemoriaPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const canFetch = typeof window !== "undefined";
  const personQuery = useQuery({ queryKey: ["person", id], queryFn: () => getPersonById(id), enabled: canFetch });
  const [form, setForm] = useState<FormState>(initialState);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!personQuery.data) return;
    setForm({
      fullName: personQuery.data.fullName,
      knownAs: personQuery.data.knownAs ?? "",
      birthDate: personQuery.data.birthDate,
      deathDate: personQuery.data.deathDate ?? "",
      biography: personQuery.data.biography,
      city: personQuery.data.city,
      country: personQuery.data.country,
      category: personQuery.data.category,
    });
    setCoverPhotoUrl(personQuery.data.coverPhotoUrl);
  }, [personQuery.data]);

  const update = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      const person = await updateMemory(id, {
        fullName: form.fullName.trim(),
        ...(form.knownAs.trim() ? { knownAs: form.knownAs.trim() } : {}),
        birthDate: form.birthDate,
        ...(form.deathDate ? { deathDate: form.deathDate } : {}),
        biography: form.biography.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        category: form.category as Category,
        ...(coverPhotoUrl ? { coverPhotoUrl } : {}),
      });
      toast.success("Post atualizado com sucesso.");
      void navigate({ to: "/memoria/$id", params: { id: person.id } });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Não foi possível editar este post.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (personQuery.isPending) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <LoadingState count={3} label="Carregando post" />
      </div>
    );
  }

  if (personQuery.isError || !personQuery.data) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10">
        <EmptyState
          title="Post não encontrado"
          description="Esta memória pode ter sido removida ou o endereço está incorreto."
          action={
            <Button asChild variant="outline">
              <Link to="/memorias">Voltar para memórias</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        <div>
          <p className="rule-label text-sage">Editar post</p>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">Editar memória</h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">
            Só o autor do post pode alterar estas informações.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 border border-border bg-card p-6 md:p-10">
          <Input
            label="Nome completo"
            required
            value={form.fullName}
            onChange={(event) => update("fullName")(event.target.value)}
            {...(errors["fullName"] ? { error: errors["fullName"] } : {})}
          />
          <Input
            label="Como era conhecida"
            value={form.knownAs}
            onChange={(event) => update("knownAs")(event.target.value)}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Nascimento"
              type="date"
              required
              value={form.birthDate}
              onChange={(event) => update("birthDate")(event.target.value)}
              {...(errors["birthDate"] ? { error: errors["birthDate"] } : {})}
            />
            <Input
              label="Falecimento"
              type="date"
              value={form.deathDate}
              onChange={(event) => update("deathDate")(event.target.value)}
              {...(errors["deathDate"] ? { error: errors["deathDate"] } : {})}
            />
          </div>
          <Textarea
            label="Biografia"
            required
            value={form.biography}
            onChange={(event) => update("biography")(event.target.value)}
            {...(errors["biography"] ? { error: errors["biography"] } : {})}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Cidade"
              required
              value={form.city}
              onChange={(event) => update("city")(event.target.value)}
              {...(errors["city"] ? { error: errors["city"] } : {})}
            />
            <Input
              label="País"
              required
              value={form.country}
              onChange={(event) => update("country")(event.target.value)}
              {...(errors["country"] ? { error: errors["country"] } : {})}
            />
          </div>
          <SelectField
            label="Categoria"
            required
            value={form.category}
            onChange={(event) => update("category")(event.target.value)}
            {...(errors["category"] ? { error: errors["category"] } : {})}
          >
            <option value="">Selecione uma categoria</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </SelectField>
          <UploadArea label="Trocar fotografia principal" onFileSelected={(_, previewUrl) => setCoverPhotoUrl(previewUrl)} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button asChild type="button" size="lg" variant="outline" className="w-full">
              <Link to="/memoria/$id" params={{ id }}>
                Cancelar
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
