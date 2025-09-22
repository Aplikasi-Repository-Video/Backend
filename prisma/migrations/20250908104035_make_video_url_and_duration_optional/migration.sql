-- DropIndex
DROP INDEX "video_public_id_key";

-- AlterTable
ALTER TABLE "video" ALTER COLUMN "public_id" DROP NOT NULL;
