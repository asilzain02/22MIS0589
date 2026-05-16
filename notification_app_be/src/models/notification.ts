// ─── Notification Types ──────────────────────────────────────────────────────

export type NotificationType = "info" | "warning" | "alert" | "success";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipientId: string;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  recipientId: string;
}

export interface NotificationFilters {
  recipientId?: string;
  type?: NotificationType;
  isRead?: boolean;
}

// ─── DB Row → Domain Model ────────────────────────────────────────────────────

export interface NotificationRow {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipient_id: string;
  is_read: boolean;
  created_at: Date;
}

export function rowToNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    recipientId: row.recipient_id,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}
