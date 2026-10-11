-- CreateTable
CREATE TABLE "AlumniTalk" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "topic" TEXT NOT NULL,
    "speakerName" TEXT NOT NULL,
    "speakerRole" TEXT,
    "speakerOrg" TEXT,
    "speakerPhoto" TEXT,
    "speakerId" TEXT,
    "talkDate" TIMESTAMP(3) NOT NULL,
    "recordingUrl" TEXT,
    "liveUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlumniTalk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlumniTalk_speakerId_idx" ON "AlumniTalk"("speakerId");

-- CreateIndex
CREATE INDEX "AlumniTalk_talkDate_idx" ON "AlumniTalk"("talkDate");

-- AddForeignKey
ALTER TABLE "AlumniTalk" ADD CONSTRAINT "AlumniTalk_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "AlumniProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
