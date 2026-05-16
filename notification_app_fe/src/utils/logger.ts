import axios from "axios";

const EVAL_URL = "http://4.224.186.213/evaluation-service/logs";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhc2lsLnphaW4yMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5MzM5NjMsImlhdCI6MTc3ODkzMzA2MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImFmMjA5NTYyLTcxMmItNGM5YS04OTk4LTZjNThkOTFmOTg5NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFzaWwgemFpbiB0IGEiLCJzdWIiOiIyM2QxNTAyNS1mNzM0LTRmOWMtYmI4OC00MzQ0N2U2YzNjYzEifSwiZW1haWwiOiJhc2lsLnphaW4yMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJuYW1lIjoiYXNpbCB6YWluIHQgYSIsInJvbGxObyI6IjIybWlzMDU4OSIsImFjY2Vzc0NvZGUiOiJTZkZ1V2ciLCJjbGllbnRJRCI6IjIzZDE1MDI1LWY3MzQtNGY5Yy1iYjg4LTQzNDQ3ZTZjM2NjMSIsImNsaWVudFNlY3JldCI6IkJia3hhSHpoS1pjVFdWRFkifQ.u4t-iRZqrNToWsizyxkDA_i0MhrrX7vgTYmn-5q5DYw";

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
