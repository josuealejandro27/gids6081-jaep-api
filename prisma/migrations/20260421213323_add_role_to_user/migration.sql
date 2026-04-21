/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(50) NOT NULL DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);
