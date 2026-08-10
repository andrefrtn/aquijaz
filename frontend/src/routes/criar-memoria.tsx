import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input, SelectField, Textarea } from "@/components/common/Input";
import { UploadArea } from "@/components/UploadArea";
import { createMemory } from "@/services/peopleService";
import { CATEGORIES, type Category } from "@/types";

export const Route = createFileRoute("/criar-memoria")({
  head: () => ({
    meta: [
      { title: "Criar memória — Aquijaz" },
      {
        name: "description",
        content:
          "Abra o arquivo de alguém: nome, datas, biografia, cidade e a primeira fotografia da memória.",
      },
      { property: "og:title", content: "Criar memória — Aquijaz" },
      {
        property: "og:description",
        content: "Abra o arquivo de alguém com nome, datas, biografia e uma fotografia.",
      },
    ],
  }),
  component: CriarMemoriaPage,
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

function validate(form: FormState, coverPhotoUrl: string | null) {
  const errors: Partial<Record<keyof FormState | "cover", string>> = {};
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
  if (!coverPhotoUrl) errors.cover = "Selecione a fotografia principal.";
  return errors;
}

function CriarMemoriaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validation = validate(form, coverPhotoUrl);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      const person = await createMemory({
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
      toast.success("Memória criada com sucesso.");
      void navigate({ to: "/memoria/$id", params: { id: person.id } });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        <div>
          <p className="rule-label text-sage">Novo arquivo</p>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">Criar memória</h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">
            Comece pelo essencial: um nome, um período, uma fotografia. O arquivo pode crescer
            depois, com imagens e histórias enviadas por outras pessoas.
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
            hint="Apelido ou nome pelo qual as pessoas a chamavam."
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
            hint="Conte o que esta pessoa fazia, onde viveu e o que costumava dizer."
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
          <UploadArea
            label="Fotografia principal"
            onFileSelected={(_, previewUrl) => setCoverPhotoUrl(previewUrl)}
            {...(errors["cover"] ? { error: errors["cover"] } : {})}
          />
          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Criando memória…" : "Criar memória"}
          </Button>
        </form>
      </div>
    </div>
  );
}