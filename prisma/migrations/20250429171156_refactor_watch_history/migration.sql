/*
  Warnings:

  - Changed the type of `duration_watch` on the `watch_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "watch_history" DROP COLUMN "duration_watch",
ADD COLUMN     "duration_watch" INTEGER NOT NULL;
