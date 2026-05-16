import type { Notification } from "../types/notification";

interface Props {
  notifications: Notification[];
}

export function StatsBar({ notifications }: Props) {
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.isRead).length;
  const byType = (type: string) =>
    notifications.filter((n) => n.type === type).length;

  return (
    <div className="stats-bar">
      <div className="stat-card stat-total">
        <span className="stat-number">{total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card stat-unread">
        <span className="stat-number">{unread}</span>
        <span className="stat-label">Unread</span>
      </div>
      <div className="stat-card stat-info">
        <span className="stat-number">{byType("info")}</span>
        <span className="stat-label">Info</span>
      </div>
      <div className="stat-card stat-success">
        <span className="stat-number">{byType("success")}</span>
        <span className="stat-label">Success</span>
      </div>
      <div className="stat-card stat-warning">
        <span className="stat-number">{byType("warning")}</span>
        <span className="stat-label">Warning</span>
      </div>
      <div className="stat-card stat-alert">
        <span className="stat-number">{byType("alert")}</span>
        <span className="stat-label">Alert</span>
      </div>
    </div>
  );
}
