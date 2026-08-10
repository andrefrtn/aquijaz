import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Reply, Send, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { ApiError } from "@/lib/api/client";
import { formatRelativeTime } from "@/lib/time";
import { getToken } from "@/services/authService";
import { createStoryReply } from "@/services/peopleService";
import type { Story, StoryReply } from "@/types";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<StoryReply | null>(null);
  const isLoggedIn = Boolean(getToken());
  const replies = story.replies ?? [];

  const replyMutation = useMutation({
    mutationFn: () =>
      createStoryReply(story.id, {
        content: content.trim(),
        ...(replyingTo ? { parentReplyId: replyingTo.id } : {}),
      }),
    onSuccess: async () => {
      setContent("");
      setReplyingTo(null);
      await queryClient.invalidateQueries({ queryKey: ["stories", story.personId] });
      toast.success("Resposta publicada.");
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Não foi possível responder esta história.";
      toast.error(message);
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (content.trim().length < 3) {
      toast.error("Escreva uma resposta com pelo menos 3 caracteres.");
      return;
    }
    replyMutation.mutate();
  }

  return (
    <article className="rounded-xs border border-border bg-card p-5 shadow-sm md:p-6">
      <div className="flex items-start gap-3">
        {story.authorAvatarUrl ? (
          <img
            src={story.authorAvatarUrl}
            alt={`Foto de ${story.author}`}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary">
            {story.author.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {story.authorId ? (
              <Link to="/usuario/$id" params={{ id: story.authorId }} className="font-semibold text-primary hover:text-accent">
                {story.author}
              </Link>
            ) : (
              <span className="font-semibold text-foreground">{story.author}</span>
            )}
            {story.year ? <span>{story.year}</span> : null}
            <span>{formatRelativeTime(story.createdAt)}</span>
          </div>
          <h3 className="font-display mt-2 text-xl leading-tight">{story.title}</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground/85">{story.content}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-sage">
          <MessageCircle size={15} aria-hidden="true" />
          {replies.length} {replies.length === 1 ? "resposta" : "respostas"}
        </div>

        {replies.length ? (
          <div className="space-y-3">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className={`flex gap-3 rounded-xs bg-background p-3 ${reply.parentReplyId ? "ml-6 border-l-2 border-sage/60" : ""}`}
              >
                {reply.authorAvatarUrl ? (
                  <img
                    src={reply.authorAvatarUrl}
                    alt={`Foto de ${reply.author}`}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">
                    {reply.author.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {reply.authorId ? (
                      <Link to="/usuario/$id" params={{ id: reply.authorId }} className="font-semibold text-primary hover:text-accent">
                        {reply.author}
                      </Link>
                    ) : (
                      <span className="font-semibold text-foreground">{reply.author}</span>
                    )}
                    {reply.targetAuthor ? (
                      <>
                        <span className="font-semibold text-foreground"> &gt; </span>
                        {reply.targetAuthorId ? (
                          <Link
                            to="/usuario/$id"
                            params={{ id: reply.targetAuthorId }}
                            className="font-semibold text-primary hover:text-accent"
                          >
                            {reply.targetAuthor}
                          </Link>
                        ) : (
                          <span className="font-semibold text-foreground">{reply.targetAuthor}</span>
                        )}
                      </>
                    ) : null}{" "}
                    comentou{" "}
                    {formatRelativeTime(reply.createdAt)}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/85">{reply.content}</p>
                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => setReplyingTo(reply)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-accent"
                    >
                      <Reply size={13} aria-hidden="true" />
                      Responder
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            {replyingTo ? (
              <div className="flex items-center justify-between gap-3 rounded-xs bg-secondary px-3 py-2 text-xs text-muted-foreground">
                <span>
                  Respondendo <span className="font-semibold text-foreground">{replyingTo.author}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  aria-label="Cancelar resposta"
                  className="text-foreground/70 transition-colors hover:text-primary"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            ) : null}
            <div className="flex gap-2">
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={2}
                placeholder={replyingTo ? `Responder ${replyingTo.author}` : "Responder esta história"}
                className="min-h-12 flex-1 resize-none rounded-xs border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Enviar resposta"
                disabled={replyMutation.isPending}
                className="h-auto min-h-12 self-stretch"
              >
                <Send size={17} aria-hidden="true" />
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            <Link to="/login" className="font-semibold text-primary underline underline-offset-4">
              Entre na sua conta
            </Link>{" "}
            para responder esta história.
          </p>
        )}
      </div>
    </article>
  );
}
