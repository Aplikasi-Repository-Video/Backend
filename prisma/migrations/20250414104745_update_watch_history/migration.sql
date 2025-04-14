/*
  Warnings:

  - Added the required column `duration_watch` to the `WathchHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WathchHistory" ADD COLUMN     "duration_watch" TEXT NOT NULL;
