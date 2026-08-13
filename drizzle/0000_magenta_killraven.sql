CREATE TABLE `analytics_daily` (
	`day` text NOT NULL,
	`event` text NOT NULL,
	`path` text DEFAULT '/' NOT NULL,
	`source` text DEFAULT 'direct' NOT NULL,
	`campaign` text DEFAULT 'untagged' NOT NULL,
	`referrer` text DEFAULT 'direct' NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`day`, `event`, `path`, `source`, `campaign`, `referrer`)
);
--> statement-breakpoint
CREATE TABLE `analytics_visitors` (
	`day` text NOT NULL,
	`visitor_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`day`, `visitor_id`)
);
