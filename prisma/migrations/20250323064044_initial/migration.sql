-- CreateTable
CREATE TABLE "DatasetLinkType" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DatasetLinkType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetBaseType" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DatasetBaseType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelBaseType" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "datasetTypeId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ModelBaseType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dataset" (
    "id" SERIAL NOT NULL,
    "datasetTypeId" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "links" TEXT[],
    "tags" TEXT[],

    CONSTRAINT "Dataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelResults" (
    "id" SERIAL NOT NULL,
    "datasetId" INTEGER NOT NULL,
    "modelTypeId" INTEGER NOT NULL,
    "params" JSONB NOT NULL,
    "extras" JSONB NOT NULL DEFAULT '{}',
    "iouScore" DOUBLE PRECISION,
    "map50Score" DOUBLE PRECISION,
    "map5095Score" DOUBLE PRECISION,
    "inferenceTime" DOUBLE PRECISION,
    "tags" TEXT[],
    "resultsS3Key" TEXT NOT NULL,
    "modelS3Key" TEXT NOT NULL,

    CONSTRAINT "ModelResults_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModelBaseType" ADD CONSTRAINT "ModelBaseType_datasetTypeId_fkey" FOREIGN KEY ("datasetTypeId") REFERENCES "DatasetBaseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_datasetTypeId_fkey" FOREIGN KEY ("datasetTypeId") REFERENCES "DatasetBaseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelResults" ADD CONSTRAINT "ModelResults_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelResults" ADD CONSTRAINT "ModelResults_modelTypeId_fkey" FOREIGN KEY ("modelTypeId") REFERENCES "ModelBaseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
