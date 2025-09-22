-- AlterTable
ALTER TABLE "video" ADD COLUMN     "public_id" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "transcript" TEXT;
