/*
  Warnings:

  - You are about to drop the column `access_key` on the `line` table. All the data in the column will be lost.
  - Added the required column `name` to the `line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `line` DROP COLUMN `access_key`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `observation` VARCHAR(191) NULL;
