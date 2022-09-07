-- AlterTable
ALTER TABLE `message` ADD COLUMN `firstAnswer` VARCHAR(191) NULL,
    ADD COLUMN `firstOption` VARCHAR(191) NULL,
    ADD COLUMN `is_survey` BOOLEAN NULL,
    ADD COLUMN `response` VARCHAR(191) NULL,
    ADD COLUMN `secondAnswer` VARCHAR(191) NULL,
    ADD COLUMN `secondOption` VARCHAR(191) NULL;
