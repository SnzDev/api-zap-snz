-- CreateTable
CREATE TABLE `message` (
    `id` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `ack` INTEGER NOT NULL,
    `message_id` VARCHAR(191) NOT NULL,
    `message_body` VARCHAR(191) NOT NULL,
    `sender` VARCHAR(191) NOT NULL,
    `destiny` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
