ALTER TABLE `habits` ADD `is_notifications_enabled` integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `habits` ADD `notification_id` text;
