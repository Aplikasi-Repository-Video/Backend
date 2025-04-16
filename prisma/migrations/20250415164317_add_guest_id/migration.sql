/*
  Warnings:

  - You are about to drop the `wathch_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "wathch_history" DROP CONSTRAINT "wathch_history_user_id_fkey";

-- DropForeignKey
ALTER TABLE "wathch_history" DROP CONSTRAINT "wathch_history_video_id_fkey";

-- DropTable
DROP TABLE "wathch_history";

-- CreateTable
CREATE TABLE "watch_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "guest_id" TEXT,
    "video_id" INTEGER NOT NULL,
    "duration_watch" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watch_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
