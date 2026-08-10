import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { UploadArea } from "@/components/UploadArea";
import { ApiError } from "@/lib/api/client";
import { signIn, signUp } from "@/services/authService";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Aquijaz" },
      {
        name: "description",
        content: "Crie sua conta no Aquijaz para abrir arquivos de memória e enviar fotografias.",
      },
      { property: "og:title", content: "Criar conta — Aquijaz" },
      { property: "og:description", content: "Crie sua conta e comece a preservar memórias." },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 3) nextErrors["name"] = "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors["email"] = "Informe um e-mail válido.";
    if (password.length < 6) nextErrors["password"] = "A senha deve ter ao menos 6 caracteres.";
    if (password !== confirm) nextErrors["confirm"] = "As senhas não coincidem.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signUp(name.trim(), email.trim(), password, "", avatarUrl);
      await signIn(email.trim(), password);
      toast.success("Conta criada e sessão iniciada com sucesso.");
      void navigate({ to: "/perfil" });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Não foi possível criar a conta agora.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-lg">
        <p className="rule-label text-sage">Conta</p>
        <h1 className="font-display mt-3 text-4xl md:text-5xl">Criar conta</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Anexe uma foto de perfil ou deixe em branco para usar a imagem padrão.
        </p>
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          <Input
            label="Nome"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            {...(errors["name"] ? { error: errors["name"] } : {})}
          />
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            {...(errors["email"] ? { error: errors["email"] } : {})}
          />
          <UploadArea
            label="Foto de perfil"
            onFileSelected={(_, previewUrl) => setAvatarUrl(previewUrl)}
            {...(errors["avatarUrl"] ? { error: errors["avatarUrl"] } : {})}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Senha"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              {...(errors["password"] ? { error: errors["password"] } : {})}
            />
            <Input
              label="Confirmar senha"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              {...(errors["confirm"] ? { error: errors["confirm"] } : {})}
            />
          </div>
          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Criando conta…" : "Criar conta"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-primary underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
