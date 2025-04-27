-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ModelBaseType" ADD COLUMN     "yamlFile" TEXT;
