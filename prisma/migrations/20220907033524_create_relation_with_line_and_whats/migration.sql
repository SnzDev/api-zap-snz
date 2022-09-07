/*
  Warnings:

  - Added the required column `acess_key` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` ADD COLUMN `acess_key` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_acess_key_fkey` FOREIGN KEY (`acess_key`) REFERENCES `line`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
