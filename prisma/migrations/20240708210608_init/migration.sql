-- AlterTable
ALTER TABLE "download_queue" ADD COLUMN     "retries" INTEGER NOT NULL DEFAULT 0;
