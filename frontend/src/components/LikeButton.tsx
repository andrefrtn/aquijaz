import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { ApiError } from "@/lib/api/client";
import { getCurrentUser, getToken } from "@/services/authService";
import { toggleLikeMemory } from "@/services/peopleService";
import type { Person } from "@/types";

interface LikeButtonProps {
  person: Person;
  variant?: "compact" | "button";
}

export function LikeButton({ person, variant = "compact" }: LikeButtonProps) {
  const queryClient = useQueryClient();
  const hasToken = typeof window !== "undefined" && Boolean(getToken());
  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: hasToken,
    retry: false,
  });
  const liked = Boolean(userQuery.data?.id && person.likedBy?.includes(userQuery.data.id));
  const likeCount = person.likeCount ?? person.likedBy?.length ?? 0;

  const mutation = useMutation({
    mutationFn: () => toggleLikeMemory(person.id),
    onSuccess: async (result) => {
      toast.success(result.liked ? "Memória curtida." : "Curtida removida.");
      await queryClient.invalidateQueries({ queryKey: ["people"] });
      await queryClient.invalidateQueries({ queryKey: ["featured"] });
      await queryClient.invalidateQueries({ queryKey: ["recent"] });
      await queryClient.invalidateQueries({ queryKey: ["person", person.id] });
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Não foi possível curtir agora.";
      toast.error(message);
    },
  });

  const label = liked ? "Remover curtida" : "Curtir memória";

  if (variant === "button") {
    return (
      <Button type="button" variant={liked ? "accent" : "outline"} onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        <Heart size={16} aria-hidden="true" fill={liked ? "currentColor" : "none"} />
        {likeCount} {likeCount === 1 ? "curtida" : "curtidas"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-primary disabled:opacity-60 ${
        liked ? "text-accent" : "text-muted-foreground"
      }`}
    >
      <Heart size={14} aria-hidden="true" fill={liked ? "currentColor" : "none"} />
      {likeCount} {likeCount === 1 ? "curtida" : "curtidas"}
    </button>
  );
}
