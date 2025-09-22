/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `video` will be added. If there are existing duplicate values, this will fail.
  - Made the column `public_id` on table `video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "video" ALTER COLUMN "public_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "video_public_id_key" ON "video"("public_id");
