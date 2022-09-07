/*
  Warnings:

  - You are about to drop the column `acess_key` on the `line` table. All the data in the column will be lost.
  - Added the required column `port` to the `line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `line` DROP COLUMN `acess_key`,
    ADD COLUMN `access_key` VARCHAR(191) NULL,
    ADD COLUMN `port` INTEGER NOT NULL;
