import { Router } from "express";
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

export const notificationRouter = Router();

// POST   /notifications         — Create a new notification
notificationRouter.post("/", createNotification);

// GET    /notifications         — List all (with optional filters)
notificationRouter.get("/", getNotifications);

// GET    /notifications/:id     — Get single notification
notificationRouter.get("/:id", getNotificationById);

// PATCH  /notifications/:id/read — Mark as read
notificationRouter.patch("/:id/read", markAsRead);

// DELETE /notifications/:id    — Delete a notification
notificationRouter.delete("/:id", deleteNotification);
