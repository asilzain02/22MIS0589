import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { StatsBar } from "./components/StatsBar";
import { NotificationForm } from "./components/NotificationForm";
import { NotificationCard } from "./components/NotificationCard";
import type { Notification, NotificationType } from "./types/notification";
import {
  fetchNotifications,
  createNotification,
  markNotificationRead,
  deleteNotification,
} from "./api/notifications";

type FilterType = "all" | NotificationType;
type FilterRead = "all" | "unread" | "read";

export default function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterRead, setFilterRead] = useState<FilterRead>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setNotifications(data as Notification[]);
    } catch {
      setError("Could not connect to backend. Make sure notification_app_be is running on port 3000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function handleCreate(data: {
    title: string;
    message: string;
    type: NotificationType;
    recipientId: string;
  }) {
    const created = await createNotification(data);
    setNotifications((prev) => [created as Notification, ...prev]);
  }

  async function handleRead(id: string) {
    const updated = await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? (updated as Notification) : n))
    );
  }

  async function handleDelete(id: string) {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered = notifications.filter((n) => {
    const typeMatch = filterType === "all" || n.type === filterType;
    const readMatch =
      filterRead === "all" ||
      (filterRead === "unread" && !n.isRead) ||
      (filterRead === "read" && n.isRead);
    return typeMatch && readMatch;
  });

  const TYPE_FILTERS: FilterType[] = ["all", "info", "success", "warning", "alert"];
  const READ_FILTERS: FilterRead[] = ["all", "unread", "read"];

  return (
    <div className="app">
      <Header onRefresh={load} loading={loading} />

      <main className="main-content">
        <StatsBar notifications={notifications} />

        <NotificationForm onSubmit={handleCreate} />

        <section className="list-section">
          <div className="list-header">
            <h2 className="list-title">
              Notifications
              <span className="list-count">{filtered.length}</span>
            </h2>

            <div className="filters">
              <div className="filter-group">
                {TYPE_FILTERS.map((f) => (
                  <button
                    key={f}
                    id={`filter-type-${f}`}
                    className={`filter-btn ${filterType === f ? "active" : ""}`}
                    onClick={() => setFilterType(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="filter-group">
                {READ_FILTERS.map((f) => (
                  <button
                    key={f}
                    id={`filter-read-${f}`}
                    className={`filter-btn ${filterRead === f ? "active" : ""}`}
                    onClick={() => setFilterRead(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading notifications…</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🔕</span>
              <p className="empty-text">No notifications found</p>
              <p className="empty-sub">
                {notifications.length === 0
                  ? "Create your first notification above."
                  : "Try adjusting the filters."}
              </p>
            </div>
          )}

          <div className="notif-list">
            {filtered.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onRead={handleRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
