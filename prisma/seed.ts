import { PrismaClient } from "@prisma/client";
import assert from "assert";

const prisma = new PrismaClient();

async function main() {
  const links = await prisma.datasetLinkType.createMany({
    data: [
      {
        value: "visdrone",
        name: "VisDrone Direct Zip",
      },
      {
        value: "roboflow",
        name: "RoboFlow Universe Link",
      },
    ],
  });

  const datasets = await prisma.datasetBaseType.createMany({
    data: [
      {
        value: "yolo",
        name: "Ultralytics YOLO Format",
      },
      {
        value: "coco",
        name: "COCO Dataset Format",
      },
    ],
  });

  const yoloDSTID = await prisma.datasetBaseType.findFirst({
    where: { value: "yolo" },
  });

  assert(yoloDSTID !== null, "Dataset type with value 'yolo' not found.");

  const models = await prisma.modelBaseType.createMany({
    data: [
      {
        value: "yolo",
        name: "YOLOv11 Baseline",
        datasetTypeId: yoloDSTID.id,
      },
      {
        value: "rtdetr",
        name: "RT-DETR Baseline",
        datasetTypeId: yoloDSTID.id,
      },
      {
        value: "custom_yolo",
        name: "Custom YOLOv8 experimental base",
        datasetTypeId: yoloDSTID.id,
      },
      {
        value: "custom_rtdetr",
        name: "Custom YOLOv8 with RTDETR experimental base",
        datasetTypeId: yoloDSTID.id,
      },
    ],
  });

  console.log({ links, datasets, models });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
