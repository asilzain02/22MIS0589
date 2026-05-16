import { useState } from "react";
import type { NotificationType } from "../types/notification";

interface Props {
  onSubmit: (data: {
    title: string;
    message: string;
    type: NotificationType;
    recipientId: string;
  }) => Promise<void>;
}

const TYPES: NotificationType[] = ["info", "success", "warning", "alert"];

export function NotificationForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");
  const [recipientId, setRecipientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !message || !recipientId) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ title, message, type, recipientId });
      setTitle("");
      setMessage("");
      setType("info");
      setRecipientId("");
    } catch {
      setError("Failed to create notification. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="notification-form" onSubmit={handleSubmit} id="create-notification-form">
      <h2 className="form-title">
        <span className="form-title-icon">＋</span> New Notification
      </h2>

      {error && <div className="form-error">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="notif-title" className="form-label">Title</label>
          <input
            id="notif-title"
            className="form-input"
            type="text"
            placeholder="Notification title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notif-recipient" className="form-label">Recipient ID</label>
          <input
            id="notif-recipient"
            className="form-input"
            type="text"
            placeholder="user_001"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notif-message" className="form-label">Message</label>
        <textarea
          id="notif-message"
          className="form-input form-textarea"
          placeholder="Describe the notification…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={3}
        />
      </div>

      <div className="form-row form-row-bottom">
        <div className="form-group type-group">
          <label className="form-label">Type</label>
          <div className="type-selector">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                id={`type-btn-${t}`}
                className={`type-btn type-${t} ${type === t ? "active" : ""}`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          id="submit-notification-btn"
          type="submit"
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Sending…" : "Create Notification"}
        </button>
      </div>
    </form>
  );
}
