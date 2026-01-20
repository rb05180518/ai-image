-- CreateIndex
CREATE INDEX `usages_user_id_created_at_idx` ON `usages`(`user_id`, `created_at` DESC);

-- CreateIndex
CREATE INDEX `usages_complete_at_idx` ON `usages`(`complete_at`);
