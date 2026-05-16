import type { Notification } from "../types/notification";

interface Props {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICONS: Record<string, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  alert: "✕",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationCard({ notification, onRead, onDelete }: Props) {
  const { id, title, message, type, recipientId, isRead, createdAt } =
    notification;

  return (
    <article
      className={`notif-card notif-${type} ${isRead ? "is-read" : "is-unread"}`}
      id={`notif-card-${id}`}
    >
      <div className="notif-left">
        <span className={`notif-type-badge badge-${type}`}>
          {TYPE_ICONS[type]}
        </span>
      </div>

      <div className="notif-body">
        <div className="notif-header-row">
          <h3 className="notif-title">{title}</h3>
          <div className="notif-meta">
            {!isRead && <span className="unread-dot" aria-label="Unread" />}
            <span className="notif-time">{timeAgo(createdAt)}</span>
          </div>
        </div>
        <p className="notif-message">{message}</p>
        <div className="notif-footer">
          <span className="notif-recipient">
            <span className="recipient-icon">👤</span> {recipientId}
          </span>
          <span className={`notif-badge type-pill-${type}`}>{type}</span>
        </div>
      </div>

      <div className="notif-actions">
        {!isRead && (
          <button
            id={`mark-read-${id}`}
            className="action-btn action-read"
            onClick={() => onRead(id)}
            title="Mark as read"
            aria-label="Mark as read"
          >
            ✓
          </button>
        )}
        <button
          id={`delete-${id}`}
          className="action-btn action-delete"
          onClick={() => onDelete(id)}
          title="Delete"
          aria-label="Delete notification"
        >
          ✕
        </button>
      </div>
    </article>
  );
}
