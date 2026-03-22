ALTER TABLE `habits` ADD `preset_name` text;--> statement-breakpoint
CREATE TABLE `user_secret_achievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`secret_achievement_id` text NOT NULL,
	`unlocked_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);