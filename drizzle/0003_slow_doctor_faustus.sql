ALTER TABLE `habits` ADD `frequency` text DEFAULT 'daily' NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `frequency_days` text;--> statement-breakpoint
ALTER TABLE `habits` ADD `target_date` integer;--> statement-breakpoint
ALTER TABLE `habits` ADD `end_date` integer;