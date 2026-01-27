/*
  Warnings:

  - You are about to drop the column `current_period_end` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `current_period_start` on the `subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[checkout_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `subscriptions_user_id_key` ON `subscriptions`;

-- AlterTable
ALTER TABLE `subscriptions` DROP COLUMN `current_period_end`,
    DROP COLUMN `current_period_start`,
    ADD COLUMN `amount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `checkout_id` VARCHAR(191) NULL,
    ADD COLUMN `currency` VARCHAR(8) NOT NULL DEFAULT 'USD',
    ADD COLUMN `paid_at` DATETIME(3) NULL,
    MODIFY `status` VARCHAR(32) NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `has_purchased` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `total_credits` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `used_credits` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `subscriptions_checkout_id_key` ON `subscriptions`(`checkout_id`);

-- CreateIndex
CREATE INDEX `subscriptions_user_id_idx` ON `subscriptions`(`user_id`);

-- CreateIndex
CREATE INDEX `subscriptions_status_idx` ON `subscriptions`(`status`);

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`clerkId`) ON DELETE RESTRICT ON UPDATE CASCADE;
