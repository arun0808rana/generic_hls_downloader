-- CreateTable
CREATE TABLE "download_queue" (
    "download_queue_id" SERIAL NOT NULL,
    "m3u8_url" TEXT NOT NULL,
    "webpage_url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "download_queue_pkey" PRIMARY KEY ("download_queue_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "download_queue_webpage_url_key" ON "download_queue"("webpage_url");
