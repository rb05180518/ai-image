/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `usages` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `task_type` VARCHAR(32) NOT NULL,
    `task_used` INTEGER NOT NULL,
    `task_id` VARCHAR(64) NOT NULL,
    `input_meta` JSON NULL,
    `output_meta` JSON NULL,
    `complete_at` DATETIME(3) NULL,
    `show_public` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `liked` TINYINT NOT NULL DEFAULT 1,

    INDEX `usages_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usages` ADD CONSTRAINT `usages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`clerkId`) ON DELETE RESTRICT ON UPDATE CASCADE;
