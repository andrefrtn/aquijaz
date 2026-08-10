import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { UserCheck, UserPlus, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { ApiError } from "@/lib/api/client";
import { useClickOutside } from "@/lib/useClickOutside";
import { getCurrentUser, getToken } from "@/services/authService";
import { acceptFriendship, getPublicUserProfile, removeFriendship } from "@/services/userService";

export function FriendRequestsMenu() {
  const queryClient = useQueryClient();
  const hasToken = typeof window !== "undefined" && Boolean(getToken());
  const userQuery = useQuery({ queryKey: ["current-user"], queryFn: getCurrentUser, enabled: hasToken, retry: false });
  const incomingIds = userQuery.data?.incomingFriendRequests ?? [];
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  useClickOutside(menuRef, open, closeMenu);

  const profiles = useQueries({
    queries: incomingIds.map((id) => ({
      queryKey: ["public-profile", id],
      queryFn: () => getPublicUserProfile(id),
      enabled: hasToken,
    })),
  });

  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "accept" | "decline" }) =>
      action === "accept" ? acceptFriendship(id) : removeFriendship(id),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(variables.action === "accept" ? "Amizade aceita." : "Solicitação recusada.");
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Não foi possível atualizar a solicitação.";
      toast.error(message);
    },
  });

  if (!hasToken) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Abrir solicitações de amizade"
        className="relative inline-flex h-11 w-11 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <UserPlus size={17} aria-hidden="true" />
        {incomingIds.length > 0 ? (
          <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.68rem] font-bold text-accent-foreground">
            {incomingIds.length > 9 ? "9+" : incomingIds.length}
          </span>
        ) : null}
      </button>

      <div
        className={`absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] origin-top-right border border-border bg-popover p-3 text-popover-foreground shadow-xl transition-all duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <p className="text-sm font-semibold">Solicitações</p>
            <span className="text-xs text-muted-foreground">{incomingIds.length} recebidas</span>
          </div>

          <div className="max-h-80 overflow-y-auto py-2">
            {incomingIds.length ? (
              <div className="space-y-2">
                {profiles.map((profileQuery, index) => {
                  const id = incomingIds[index];
                  const profile = profileQuery.data;

                  return (
                    <div key={id} className="flex items-center gap-3 rounded-xs p-3 transition-colors hover:bg-secondary">
                      {profile?.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={`Foto de ${profile.name}`}
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-full bg-secondary" />
                      )}
                      <div className="min-w-0 flex-1">
                        <Link
                          to="/usuario/$id"
                          params={{ id }}
                          onClick={() => setOpen(false)}
                          className="block truncate text-sm font-semibold text-foreground hover:text-primary"
                        >
                          {profile?.name ?? "Carregando..."}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">{profile?.city ?? "Quer adicionar você"}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          size="icon"
                          aria-label="Aceitar amizade"
                          onClick={() => mutation.mutate({ id, action: "accept" })}
                          disabled={mutation.isPending}
                          className="h-9 w-9"
                        >
                          <UserCheck size={15} aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          aria-label="Recusar amizade"
                          onClick={() => mutation.mutate({ id, action: "decline" })}
                          disabled={mutation.isPending}
                          className="h-9 w-9"
                        >
                          <X size={15} aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                Nenhuma solicitação recebida.
              </p>
            )}
          </div>
      </div>
    </div>
  );
}
