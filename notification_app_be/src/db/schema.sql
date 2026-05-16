-- PostgreSQL schema for the notification system
-- Run this script manually or it is auto-applied on server startup via initDB()

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_notifications_recipient
    ON notifications (recipient_id);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read
    ON notifications (is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_type
    ON notifications (type);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
    ON notifications (created_at DESC);
