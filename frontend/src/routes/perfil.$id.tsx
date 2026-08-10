import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, UserCheck, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { PersonCard } from "@/components/PersonCard";
import { ApiError } from "@/lib/api/client";
import { formatLongDate } from "@/lib/format";
import { getCurrentUser, getToken } from "@/services/authService";
import { getPeople } from "@/services/peopleService";
import { acceptFriendship, getPublicUserProfile, removeFriendship, requestFriendship } from "@/services/userService";

export const Route = createFileRoute("/perfil/$id")({
  head: () => ({
    meta: [
      { title: "Perfil — Aquijaz" },
      {
        name: "description",
        content: "Veja o perfil público e as memórias criadas por uma pessoa no Aquijaz.",
      },
    ],
  }),
  component: PublicPerfilPage,
});

function PublicPerfilPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const canFetch = typeof window !== "undefined";
  const hasToken = canFetch && Boolean(getToken());

  const userQuery = useQuery({ queryKey: ["current-user"], queryFn: getCurrentUser, enabled: hasToken, retry: false });
  const profileQuery = useQuery({
    queryKey: ["public-profile", id],
    queryFn: () => getPublicUserProfile(id),
    enabled: canFetch,
  });
  const peopleQuery = useQuery({
    queryKey: ["people", "public-profile", id],
    queryFn: () => getPeople({ pageSize: 100, sort: "az" }),
    enabled: canFetch,
  });

  const profile = profileQuery.data;
  const currentUser = userQuery.data;
  const authoredPeople = peopleQuery.data?.items.filter((person) => person.authorId === profile?.id) ?? [];
  const isOwnProfile = currentUser?.id === profile?.id;
  const areFriends = Boolean(profile?.id && currentUser?.friends?.includes(profile.id));
  const hasSentRequest = Boolean(profile?.id && currentUser?.outgoingFriendRequests?.includes(profile.id));
  const hasIncomingRequest = Boolean(profile?.id && currentUser?.incomingFriendRequests?.includes(profile.id));
  const friendCount = profile?.friends?.length ?? 0;

  const friendshipMutation = useMutation({
    mutationFn: async (action: "request" | "accept" | "remove") => {
      if (action === "accept") return acceptFriendship(id);
      if (action === "remove") return removeFriendship(id);
      return requestFriendship(id);
    },
    onSuccess: async (_, action) => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      await queryClient.invalidateQueries({ queryKey: ["public-profile", id] });
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(
        action === "accept"
          ? "Amizade aceita."
          : action === "remove"
            ? "Amizade removida."
            : "Solicitação enviada.",
      );
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Não foi possível atualizar a amizade.";
      toast.error(message);
    },
  });

  if (profileQuery.isPending) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <LoadingState count={3} label="Carregando perfil" />
      </div>
    );
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10">
        <EmptyState title="Perfil não encontrado" description="Esse usuário pode ter sido removido." />
      </div>
    );
  }

  function renderFriendButton() {
    if (!currentUser) {
      return (
        <Button asChild variant="outline">
          <Link to="/login">Entrar para adicionar</Link>
        </Button>
      );
    }

    if (isOwnProfile) {
      return (
        <Button asChild variant="outline">
          <Link to="/perfil">Meu perfil</Link>
        </Button>
      );
    }

    if (areFriends) {
      return (
        <Button type="button" variant="outline" onClick={() => friendshipMutation.mutate("remove")}>
          <UserMinus size={16} aria-hidden="true" />
          Remover amizade
        </Button>
      );
    }

    if (hasIncomingRequest) {
      return (
        <Button type="button" onClick={() => friendshipMutation.mutate("accept")}>
          <UserCheck size={16} aria-hidden="true" />
          Aceitar amizade
        </Button>
      );
    }

    if (hasSentRequest) {
      return (
        <Button type="button" variant="outline" disabled>
          Solicitação enviada
        </Button>
      );
    }

    return (
      <Button type="button" onClick={() => friendshipMutation.mutate("request")}>
        <UserPlus size={16} aria-hidden="true" />
        Adicionar amizade
      </Button>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
      <header className="border-b border-border pb-10">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="flex min-w-0 items-center gap-5">
            <img
              src={profile.avatarUrl}
              alt={`Retrato de ${profile.name}`}
              className="h-20 w-20 shrink-0 rounded-full border border-border object-cover"
            />
            <div className="min-w-0">
              <p className="rule-label text-sage">Perfil público</p>
              <h1 className="font-display truncate text-3xl leading-tight md:text-4xl">{profile.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>{profile.city || "Cidade não informada"}</span>
                <span className="text-foreground">
                  <strong className="font-semibold">{friendCount}</strong> seguindo
                </span>
                <span className="text-foreground">
                  <strong className="font-semibold">{friendCount}</strong> seguidores
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">{renderFriendButton()}</div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-foreground">
            <MapPin size={15} aria-hidden="true" />
            {profile.city || "Cidade não informada"}
          </span>
          <span className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-foreground">
            <CalendarDays size={15} aria-hidden="true" />
            No Aquijaz desde {formatLongDate(profile.memberSince)}
          </span>
          <span className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-foreground">
            {authoredPeople.length} {authoredPeople.length === 1 ? "memória criada" : "memórias criadas"}
          </span>
        </div>
      </header>

      <section aria-labelledby="memorias-publicas" className="mt-12">
        <h2 id="memorias-publicas" className="font-display border-b border-border pb-4 text-2xl md:text-3xl">
          Memórias criadas por {profile.name}
        </h2>
        <div className="mt-8">
          {peopleQuery.isPending ? (
            <LoadingState count={3} />
          ) : authoredPeople.length ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {authoredPeople.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhuma memória criada" description="As contribuições públicas aparecerão aqui." />
          )}
        </div>
      </section>
    </div>
  );
}
