/*
  Warnings:

  - You are about to drop the column `postId` on the `comment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Comment_postId_idx` ON `comment`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `postId`,
    ADD COLUMN `replyToCommentId` VARCHAR(191) NULL,
    ADD COLUMN `replyToPostId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `NiuBi` DECIMAL(65, 30) NOT NULL DEFAULT 10;

-- CreateIndex
CREATE INDEX `Comment_replyToCommentId_idx` ON `Comment`(`replyToCommentId`);

-- CreateIndex
CREATE INDEX `Comment_replyToPostId_idx` ON `Comment`(`replyToPostId`);

-- CreateIndex
CREATE INDEX `Notification_senderId_idx` ON `Notification`(`senderId`);
