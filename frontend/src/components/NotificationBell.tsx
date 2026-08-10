import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { formatRelativeTime } from "@/lib/time";
import { useClickOutside } from "@/lib/useClickOutside";
import { getToken } from "@/services/authService";
import { getNotifications, markNotificationsRead } from "@/services/notificationService";

export function NotificationBell() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hasToken = typeof window !== "undefined" && Boolean(getToken());
  const closeMenu = useCallback(() => setOpen(false), []);
  useClickOutside(menuRef, open, closeMenu);

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: hasToken,
    retry: false,
  });

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const readMutation = useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  function toggleOpen() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && unreadCount > 0) readMutation.mutate();
  }

  if (!hasToken) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Abrir notificações"
        className="relative inline-flex h-11 w-11 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Bell size={17} aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.68rem] font-bold text-accent-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      <div
        className={`absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] origin-top-right border border-border bg-popover p-3 text-popover-foreground shadow-xl transition-all duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <p className="text-sm font-semibold">Notificações</p>
            <span className="text-xs text-muted-foreground">{notifications.length} no total</span>
          </div>

          <div className="max-h-80 overflow-y-auto py-2">
            {notifications.length ? (
              <div className="space-y-1">
                {notifications.map((notification) => {
                  const content = (
                    <>
                      {notification.actorAvatarUrl ? (
                        <img
                          src={notification.actorAvatarUrl}
                          alt={`Foto de ${notification.actorName}`}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">
                          {notification.actorName.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <span className="min-w-0 text-sm leading-relaxed">
                        <span className="block text-foreground">{notification.message}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </span>
                    </>
                  );

                  return notification.profileUserId ? (
                    <Link
                      key={notification.id}
                      to="/usuario/$id"
                      params={{ id: notification.profileUserId }}
                      onClick={() => setOpen(false)}
                      className="flex gap-3 rounded-xs p-3 transition-colors hover:bg-secondary"
                    >
                      {content}
                    </Link>
                  ) : (
                    <Link
                      key={notification.id}
                      to="/memoria/$id"
                      params={{ id: notification.personId ?? "" }}
                      onClick={() => setOpen(false)}
                      className="flex gap-3 rounded-xs p-3 transition-colors hover:bg-secondary"
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">Nenhuma notificação ainda.</p>
            )}
          </div>
      </div>
    </div>
  );
}
