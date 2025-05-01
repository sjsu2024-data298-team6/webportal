-- AlterTable
ALTER TABLE "DatasetLinkType" ADD COLUMN     "extras" TEXT[] DEFAULT ARRAY[]::TEXT[];
