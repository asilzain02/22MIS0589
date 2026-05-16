import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const EVAL_URL = "http://4.224.186.213/evaluation-service/logs";
const TOKEN = process.env.AFFORDMED_TOKEN ?? "your Bearer Token";

/**
 * Sends a structured log entry to the Affordmed evaluation server.
 * @param stack   - Application layer (e.g. "backend", "frontend")
 * @param level   - Log severity: "info" | "warning" | "error" | "debug"
 * @param pkg     - Module/package name (e.g. "database", "notifications")
 * @param message - Descriptive log message
 */
export async function Log(
  stack: string,
  level: string,
  pkg: string,
  message: string
): Promise<void> {
  try {
    await axios.post(
      EVAL_URL,
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
  } catch {
    // Silently fail — logging must never crash the application
  }
}
