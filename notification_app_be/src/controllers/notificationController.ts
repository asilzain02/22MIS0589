import type { Request, Response } from "express";
import { pool } from "../db/index.js";
import {
  rowToNotification,
  type CreateNotificationDto,
  type NotificationFilters,
  type NotificationRow,
} from "../models/notification.js";
import { Log } from "../utils/logger.js";

// ─── Create Notification ──────────────────────────────────────────────────────

export async function createNotification(
  req: Request,
  res: Response
): Promise<void> {
  const { title, message, type, recipientId } =
    req.body as Partial<CreateNotificationDto>;

  // Validation
  if (!title || !message || !type || !recipientId) {
    await Log(
      "backend",
      "warning",
      "notifications",
      `Invalid payload — missing fields: ${JSON.stringify(req.body)}`
    );
    res.status(400).json({
      error: "All fields are required: title, message, type, recipientId",
    });
    return;
  }

  const allowedTypes = ["info", "warning", "alert", "success"];
  if (!allowedTypes.includes(type)) {
    await Log(
      "backend",
      "warning",
      "notifications",
      `Invalid notification type: ${type}`
    );
    res.status(400).json({
      error: `Invalid type. Must be one of: ${allowedTypes.join(", ")}`,
    });
    return;
  }

  try {
    const result = await pool.query<NotificationRow>(
      `INSERT INTO notifications (title, message, type, recipient_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, message, type, recipientId]
    );

    const notification = rowToNotification(result.rows[0]!);
    await Log(
      "backend",
      "info",
      "notifications",
      `Created notification id=${notification.id} type=${type} for recipient=${recipientId}`
    );

    res.status(201).json(notification);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await Log("backend", "error", "database", `Insert failed: ${msg}`);
    res.status(500).json({ error: "Failed to create notification" });
  }
}

// ─── Get All Notifications ────────────────────────────────────────────────────

export async function getNotifications(
  req: Request,
  res: Response
): Promise<void> {
  const { recipientId, type, isRead } = req.query as Partial<{
    recipientId: string;
    type: string;
    isRead: string;
  }>;

  const filters: NotificationFilters = {};
  if (recipientId) filters.recipientId = recipientId;
  if (type) filters.type = type as NotificationFilters["type"];
  if (isRead !== undefined) filters.isRead = isRead === "true";

  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (filters.recipientId) {
    conditions.push(`recipient_id = $${idx++}`);
    values.push(filters.recipientId);
  }
  if (filters.type) {
    conditions.push(`type = $${idx++}`);
    values.push(filters.type);
  }
  if (filters.isRead !== undefined) {
    conditions.push(`is_read = $${idx++}`);
    values.push(filters.isRead);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const result = await pool.query<NotificationRow>(
      `SELECT * FROM notifications ${where} ORDER BY created_at DESC`,
      values
    );

    const notifications = result.rows.map(rowToNotification);
    await Log(
      "backend",
      "info",
      "notifications",
      `Fetched ${notifications.length} notifications`
    );

    res.json(notifications);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await Log("backend", "error", "database", `Fetch all failed: ${msg}`);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

// ─── Get Single Notification ──────────────────────────────────────────────────

export async function getNotificationById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const result = await pool.query<NotificationRow>(
      `SELECT * FROM notifications WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      await Log(
        "backend",
        "warning",
        "notifications",
        `Notification not found: id=${id}`
      );
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    const notification = rowToNotification(result.rows[0]!);
    await Log(
      "backend",
      "info",
      "notifications",
      `Fetched notification id=${id}`
    );
    res.json(notification);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await Log("backend", "error", "database", `Fetch by id failed: ${msg}`);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
}

// ─── Mark as Read ─────────────────────────────────────────────────────────────

export async function markAsRead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await pool.query<NotificationRow>(
      `UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    const notification = rowToNotification(result.rows[0]!);
    await Log(
      "backend",
      "info",
      "notifications",
      `Marked notification id=${id} as read`
    );
    res.json(notification);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await Log(
      "backend",
      "error",
      "database",
      `Mark as read failed: ${msg}`
    );
    res.status(500).json({ error: "Failed to update notification" });
  }
}

// ─── Delete Notification ──────────────────────────────────────────────────────

export async function deleteNotification(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM notifications WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    await Log(
      "backend",
      "info",
      "notifications",
      `Deleted notification id=${id}`
    );
    res.status(204).send();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await Log("backend", "error", "database", `Delete failed: ${msg}`);
    res.status(500).json({ error: "Failed to delete notification" });
  }
}
