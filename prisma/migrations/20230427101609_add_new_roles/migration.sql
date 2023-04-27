-- AlterTable
ALTER TABLE `comment` ADD COLUMN `MarkAsDelete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `commentCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `reEnginedCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `MarkAsDelete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `originalAuthorId` VARCHAR(191) NULL,
    ADD COLUMN `reported` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `repost` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('SHEEP', 'ENGIINE', 'VERYFIED_ENGINE', 'ADMIN', 'ADMIN_VERYFIED_ENGINE') NOT NULL DEFAULT 'SHEEP';

-- CreateIndex
CREATE INDEX `Post_originalAuthorId_idx` ON `Post`(`originalAuthorId`);
