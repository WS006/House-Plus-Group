CREATE TABLE `emailLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`type` enum('inquiry_confirmation','inquiry_response','order_confirmation','order_update','newsletter') NOT NULL,
	`relatedId` int,
	`status` enum('sent','failed','bounced') DEFAULT 'sent',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`country` varchar(100),
	`message` text,
	`quantity` varchar(100),
	`language` varchar(10) DEFAULT 'en',
	`status` enum('new','contacted','quoted','closed') DEFAULT 'new',
	`source` enum('website','whatsapp','email') DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`inquiryId` int,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`items` json,
	`totalAmount` decimal(12,2),
	`status` enum('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
	`shippingAddress` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameCn` varchar(255),
	`descEn` text,
	`descCn` text,
	`category` enum('solar','appliances','3c') NOT NULL,
	`image` text,
	`moq` varchar(100),
	`delivery` varchar(100),
	`price` decimal(10,2),
	`specs` json,
	`isHot` boolean DEFAULT false,
	`isNew` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
