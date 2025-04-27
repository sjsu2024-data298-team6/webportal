-- AlterTable
ALTER TABLE "ModelResults" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tfjsS3Key" TEXT NOT NULL DEFAULT '';
