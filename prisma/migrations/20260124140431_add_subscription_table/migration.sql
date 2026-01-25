-- CreateTable
CREATE TABLE `subscriptions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `creem_customer_id` VARCHAR(191) NULL,
    `creem_subscription_id` VARCHAR(191) NULL,
    `product_id` VARCHAR(191) NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'inactive',
    `credits` INTEGER NOT NULL DEFAULT 0,
    `current_period_start` DATETIME(3) NULL,
    `current_period_end` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscriptions_user_id_key`(`user_id`),
    INDEX `subscriptions_creem_customer_id_idx`(`creem_customer_id`),
    INDEX `subscriptions_creem_subscription_id_idx`(`creem_subscription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
