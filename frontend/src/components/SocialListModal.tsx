import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { getPublicUserProfile } from "@/services/userService";

interface SocialListModalProps {
  title: string;
  ids: string[];
  onClose: () => void;
}

export function SocialListModal({ title, ids, onClose }: SocialListModalProps) {
  const profiles = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["public-profile", id],
      queryFn: () => getPublicUserProfile(id),
      enabled: Boolean(id),
    })),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4" onClick={onClose}>
      <div
        className="w-full max-w-md border border-border bg-popover text-popover-foreground shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[28rem] overflow-y-auto p-3">
          {ids.length ? (
            <div className="space-y-1">
              {profiles.map((profileQuery, index) => {
                const id = ids[index];
                const profile = profileQuery.data;

                return (
                  <Link
                    key={id}
                    to="/usuario/$id"
                    params={{ id }}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xs p-3 transition-colors hover:bg-secondary"
                  >
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={`Foto de ${profile.name}`}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-secondary" />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {profile?.name ?? "Carregando..."}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{profile?.city ?? ""}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nenhum usuário para mostrar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
