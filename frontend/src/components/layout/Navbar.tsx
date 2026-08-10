import { Link } from "@tanstack/react-router";
import { Menu, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";

const links = [
  { to: "/explorar", label: "Explorar" },
  { to: "/memorias", label: "Memórias" },
  { to: "/sobre", label: "Sobre" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-[2px]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:px-10">
        <div className="flex min-w-0 items-center gap-10">
          <Link to="/" className="font-display shrink-0 text-xl tracking-[0.22em] text-primary">
            AQUIJAZ
          </Link>
          <nav aria-label="Navegação principal" className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/explorar"
            aria-label="Pesquisar memórias"
            className="hidden h-11 w-11 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary sm:inline-flex"
          >
            <Search size={17} aria-hidden="true" />
          </Link>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/criar-memoria">
              <Plus size={15} aria-hidden="true" />
              Criar memória
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-11 w-11 items-center justify-center border border-border lg:hidden"
          >
            {open ? <Menu size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="menu-mobile" className="border-t border-border bg-background lg:hidden">
          <nav aria-label="Navegação móvel" className="mx-auto flex max-w-[1400px] flex-col px-5 py-2 md:px-10">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/70 py-4 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="border-b border-border/70 py-4 text-sm font-medium">
              Entrar
            </Link>
            <div className="py-4">
              <Button asChild className="w-full">
                <Link to="/criar-memoria" onClick={() => setOpen(false)}>
                  <Plus size={15} aria-hidden="true" />
                  Criar memória
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}