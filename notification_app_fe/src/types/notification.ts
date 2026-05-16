export type NotificationType = "info" | "warning" | "alert" | "success";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipientId: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  recipientId: string;
}
