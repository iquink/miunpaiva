ALTER TABLE `preset_items` ADD `default_type` text DEFAULT 'boolean' NOT NULL;--> statement-breakpoint
ALTER TABLE `preset_items` ADD `default_goal` integer;--> statement-breakpoint
ALTER TABLE `preset_items` ADD `default_unit` text;