import axios from "axios";
import { Log } from "../utils/logger";

const BASE = "/notifications";

export async function fetchNotifications() {
  await Log("frontend", "info", "api", "Fetching all notifications");
  const res = await axios.get(BASE);
  return res.data;
}

export async function createNotification(data: {
  title: string;
  message: string;
  type: string;
  recipientId: string;
}) {
  await Log(
    "frontend",
    "info",
    "api",
    `Creating notification: "${data.title}" for ${data.recipientId}`
  );
  const res = await axios.post(BASE, data);
  return res.data;
}

export async function markNotificationRead(id: string) {
  await Log("frontend", "info", "api", `Marking notification ${id} as read`);
  const res = await axios.patch(`${BASE}/${id}/read`);
  return res.data;
}

export async function deleteNotification(id: string) {
  await Log("frontend", "info", "api", `Deleting notification ${id}`);
  await axios.delete(`${BASE}/${id}`);
}
