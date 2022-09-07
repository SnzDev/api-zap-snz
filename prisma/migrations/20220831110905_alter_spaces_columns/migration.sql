/*
  Warnings:

  - You are about to drop the column `firstAnswer` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `firstOption` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `secondAnswer` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `secondOption` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `firstAnswer`,
    DROP COLUMN `firstOption`,
    DROP COLUMN `secondAnswer`,
    DROP COLUMN `secondOption`,
    ADD COLUMN `first_answer` VARCHAR(191) NULL,
    ADD COLUMN `first_option` VARCHAR(191) NULL,
    ADD COLUMN `second_answer` VARCHAR(191) NULL,
    ADD COLUMN `second_option` VARCHAR(191) NULL;
