import axios from "axios";

const EVAL_URL = "http://4.224.186.213/evaluation-service/logs";
const TOKEN = "your Bearer Token";

/**
 * Sends a structured log entry to the Affordmed evaluation server.
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
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
  } catch {
    // Silently fail — logging must never crash the UI
  }
}
