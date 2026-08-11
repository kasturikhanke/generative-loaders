CREATE TABLE `analytics_daily` (
	`day` text NOT NULL,
	`event` text NOT NULL,
	`source` text DEFAULT 'direct' NOT NULL,
	`campaign` text DEFAULT 'untagged' NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`day`, `event`, `source`, `campaign`)
);
