/*
  Warnings:

  - A unique constraint covering the columns `[user_id,video_id]` on the table `like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "like_user_id_video_id_key" ON "like"("user_id", "video_id");
