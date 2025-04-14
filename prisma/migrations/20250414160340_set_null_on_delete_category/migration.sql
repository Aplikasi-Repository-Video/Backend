-- DropForeignKey
ALTER TABLE "video" DROP CONSTRAINT "video_category_id_fkey";

-- AlterTable
ALTER TABLE "video" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
