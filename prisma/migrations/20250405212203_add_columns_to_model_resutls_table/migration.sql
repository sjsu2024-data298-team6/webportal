-- AlterTable
ALTER TABLE "ModelResults" 
ADD COLUMN     "tfjsS3Key" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
