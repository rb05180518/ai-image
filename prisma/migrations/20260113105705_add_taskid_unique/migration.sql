/*
  Warnings:

  - A unique constraint covering the columns `[task_id]` on the table `usages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `usages_task_id_key` ON `usages`(`task_id`);
