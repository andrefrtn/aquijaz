import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LogOut, Menu, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { FriendRequestsMenu } from "@/components/FriendRequestsMenu";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clearToken, getCurrentUser, getToken, logout } from "@/services/authService";

const links = [
  { to: "/explorar", label: "Explorar" },
  { to: "/memorias", label: "Memórias" },
  { to: "/sobre", label: "Sobre" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [authVersion, setAuthVersion] = useState(0);
  const hasToken = typeof window !== "undefined" && Boolean(getToken());

  useEffect(() => {
    const updateAuthState = () => setAuthVersion((value) => value + 1);
    window.addEventListener("aquijaz-auth-changed", updateAuthState);
    updateAuthState();

    return () => window.removeEventListener("aquijaz-auth-changed", updateAuthState);
  }, []);

  const userQuery = useQuery({
    queryKey: ["current-user", authVersion],
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch {
        clearToken();
        return null;
      }
    },
    enabled: hasToken,
    retry: false,
  });
  const user = userQuery.data;

  async function handleLogout() {
    try {
      await logout();
    } catch {
      clearToken();
    } finally {
      setOpen(false);
      window.location.reload();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-[2px]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:px-10">
        <div className="flex min-w-0 items-center gap-10">
          <Link to="/" aria-label="Aquijaz" className="shrink-0">
            <img
              src="/aquijaz-logo.png"
              alt="Aquijaz"
              className="h-12 w-28 object-contain"
            />
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
          <ThemeToggle />
          <FriendRequestsMenu />
          <NotificationBell />
          <Link
            to="/explorar"
            aria-label="Pesquisar memórias"
            className="hidden h-11 w-11 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary sm:inline-flex"
          >
            <Search size={17} aria-hidden="true" />
          </Link>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to={user ? "/perfil" : "/login"}>{user ? `Olá, ${user.name}!` : "Entrar"}</Link>
          </Button>
          {user ? (
            <Button type="button" variant="outline" size="sm" onClick={handleLogout} className="hidden sm:inline-flex">
              <LogOut size={15} aria-hidden="true" />
              Sair
            </Button>
          ) : null}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to={user ? "/criar-memoria" : "/login"}>
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
            <Menu size={18} aria-hidden="true" />
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
            <Link
              to={user ? "/perfil" : "/login"}
              onClick={() => setOpen(false)}
              className="border-b border-border/70 py-4 text-sm font-medium"
            >
              {user ? `Olá, ${user.name}!` : "Entrar"}
            </Link>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 border-b border-border/70 py-4 text-left text-sm font-medium"
              >
                <LogOut size={15} aria-hidden="true" />
                Sair da conta
              </button>
            ) : null}
            <div className="py-4">
              <Button asChild className="w-full">
                <Link to={user ? "/criar-memoria" : "/login"} onClick={() => setOpen(false)}>
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
