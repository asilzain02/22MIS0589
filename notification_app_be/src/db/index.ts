import pg from "pg";
import dotenv from "dotenv";
import { Log } from "../utils/logger.js";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "5432", 10),
  database: process.env.DB_NAME ?? "notifications_db",
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "",
});

/**
 * Initializes the database: tests the connection and applies schema.
 */
export async function initDB(): Promise<void> {
  // Test connection
  const client = await pool.connect();
  await Log("backend", "info", "database", "Connected to PostgreSQL successfully");

  try {
    // Create extension for UUID generation
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        title        VARCHAR(255) NOT NULL,
        message      TEXT         NOT NULL,
        type         VARCHAR(50)  NOT NULL
                       CHECK (type IN ('info', 'warning', 'alert', 'success')),
        recipient_id VARCHAR(255) NOT NULL,
        is_read      BOOLEAN      NOT NULL DEFAULT false,
        created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications (recipient_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read   ON notifications (is_read);
      CREATE INDEX IF NOT EXISTS idx_notifications_type      ON notifications (type);
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at DESC);
    `);

    await Log("backend", "info", "database", "Schema initialized and indexes applied");
    console.log("✅ Database schema ready");
  } finally {
    client.release();
  }
}
