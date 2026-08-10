import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div className="max-w-sm">
          <p className="font-display text-xl tracking-[0.22em] text-primary">AQUIJAZ</p>
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
          <p>© {new Date().getFullYear()} Aquijaz. Preservar também é lembrar.</p>
          <p>Imagens demonstrativas de uso livre.</p>
        </div>
      </div>
    </footer>
  );
}