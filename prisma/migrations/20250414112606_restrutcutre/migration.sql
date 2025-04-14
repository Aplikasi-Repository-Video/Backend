/*
  Warnings:

  - You are about to drop the column `userId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `video` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `video` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `wathch_history` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `wathch_history` table. All the data in the column will be lost.
  - Changed the type of `user_id` on the `comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `video_id` on the `comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `like` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `video_id` on the `like` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category_id` on the `video` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `video` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `wathch_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `video_id` on the `wathch_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_videoId_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_userId_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_videoId_fkey";

-- DropForeignKey
ALTER TABLE "video" DROP CONSTRAINT "video_userId_fkey";

-- DropForeignKey
ALTER TABLE "wathch_history" DROP CONSTRAINT "wathch_history_userId_fkey";

-- DropForeignKey
ALTER TABLE "wathch_history" DROP CONSTRAINT "wathch_history_videoId_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "userId",
DROP COLUMN "videoId",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "video_id",
ADD COLUMN     "video_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "like" DROP COLUMN "userId",
DROP COLUMN "videoId",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "video_id",
ADD COLUMN     "video_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "video" DROP COLUMN "categoryId",
DROP COLUMN "userId",
DROP COLUMN "category_id",
ADD COLUMN     "category_id" INTEGER NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "wathch_history" DROP COLUMN "userId",
DROP COLUMN "videoId",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "video_id",
ADD COLUMN     "video_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wathch_history" ADD CONSTRAINT "wathch_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wathch_history" ADD CONSTRAINT "wathch_history_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
