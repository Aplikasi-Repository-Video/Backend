/*
  Warnings:

  - A unique constraint covering the columns `[user_id,video_id]` on the table `watch_history` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guest_id,video_id]` on the table `watch_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "watch_history_user_id_video_id_key" ON "watch_history"("user_id", "video_id");

-- CreateIndex
CREATE UNIQUE INDEX "watch_history_guest_id_video_id_key" ON "watch_history"("guest_id", "video_id");
