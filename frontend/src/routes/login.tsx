import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { ApiError } from "@/lib/api/client";
import { signIn } from "@/services/authService";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Aquijaz" },
      { name: "description", content: "Acesse sua conta do Aquijaz para gerir memórias e fotografias." },
      { property: "og:title", content: "Entrar — Aquijaz" },
      { property: "og:description", content: "Acesse sua conta do Aquijaz." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors["email"] = "Informe um e-mail válido.";
    if (password.length < 6) nextErrors["password"] = "A senha deve ter ao menos 6 caracteres.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Sessão iniciada com sucesso.");
      window.location.assign("/perfil");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Não foi possível entrar agora.";
      setErrors({ password: message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
      <div className="hidden border border-border bg-beige md:block">
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&h=1100&q=80"
          alt="Composição de fotografias antigas sobre uma mesa"
          className="h-full w-full object-cover grayscale"
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="rule-label text-sage">Conta</p>
        <h1 className="font-display mt-3 text-4xl md:text-5xl">Entrar</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Entre para publicar memórias, enviar fotografias e ver apenas dados criados por usuários.
        </p>
        <form onSubmit={handleSubmit} noValidate className="mt-8 max-w-md space-y-6">
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            {...(errors["email"] ? { error: errors["email"] } : {})}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            {...(errors["password"] ? { error: errors["password"] } : {})}
          />
          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Entrando…" : "Entrar"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="text-primary underline underline-offset-4">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
