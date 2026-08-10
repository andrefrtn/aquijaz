import { Link } from "@tanstack/react-router";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div className="max-w-sm">
          <Link to="/" aria-label="Aquijaz" className="inline-flex">
            <img
              src="/aquijaz-logo.png"
              alt="Aquijaz"
              className="h-16 w-36 object-contain"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Um arquivo aberto de fotografias, histórias e lembranças. Cada memória adicionada é uma
            imagem que deixa de se perder.
          </p>
        </div>
        <nav aria-label="Navegação do rodapé" className="flex flex-col gap-3 text-sm">
          <p className="rule-label text-muted-foreground">Navegar</p>
          <Link to="/explorar" className="hover:text-primary">Explorar</Link>
          <Link to="/memorias" className="hover:text-primary">Memórias</Link>
          <Link to="/criar-memoria" className="hover:text-primary">Criar memória</Link>
          <Link to="/sobre" className="hover:text-primary">Sobre</Link>
        </nav>
        <div className="flex flex-col gap-3 text-sm">
          <p className="rule-label text-muted-foreground">Conta</p>
          <Link to="/login" className="hover:text-primary">Entrar</Link>
          <Link to="/cadastro" className="hover:text-primary">Criar conta</Link>
          <Link to="/perfil" className="hover:text-primary">Meu perfil</Link>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-10">
          <p>Desenvolvido por andre fortini 2026.</p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/andre-fortini-dev/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn de Andre Fortini"
              className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Linkedin size={16} aria-hidden="true" />
            </a>
            <a
              href="https://github.com/andrefrtn"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub de Andre Fortini"
              className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Github size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
