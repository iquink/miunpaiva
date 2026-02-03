CREATE TABLE `achievement_criteria` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`achievement_id` integer NOT NULL,
	`habit_id` integer NOT NULL,
	`rule_type` text NOT NULL,
	`target_value` integer NOT NULL,
	`days_period` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`achievement_id`) REFERENCES `achievements`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_achievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`icon_slug` text DEFAULT 'medal' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_achievements`("id", "user_id", "title", "description", "icon_slug") SELECT "id", "user_id", "title", "description", "icon_slug" FROM `achievements`;--> statement-breakpoint
DROP TABLE `achievements`;--> statement-breakpoint
ALTER TABLE `__new_achievements` RENAME TO `achievements`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `habits` ADD `description` text;