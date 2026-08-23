CREATE TABLE `marketplace_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`clientName` varchar(160) NOT NULL,
	`title` varchar(160) NOT NULL,
	`category` varchar(80) NOT NULL,
	`budget` varchar(80) NOT NULL,
	`deadline` varchar(80) NOT NULL,
	`description` text NOT NULL,
	`skills` text NOT NULL,
	`status` enum('open','closed','completed') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketplace_projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplace_proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`freelancerId` int NOT NULL,
	`freelancerName` varchar(160) NOT NULL,
	`contact` varchar(320) NOT NULL,
	`expectedBudget` varchar(80) NOT NULL,
	`coverLetter` text NOT NULL,
	`status` enum('submitted','accepted','rejected','completed') NOT NULL DEFAULT 'submitted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketplace_proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplace_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`proposalId` int NOT NULL,
	`clientId` int NOT NULL,
	`freelancerId` int NOT NULL,
	`rating` int NOT NULL,
	`feedback` text NOT NULL,
	`verified` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `marketplace_reviews_id` PRIMARY KEY(`id`)
);
