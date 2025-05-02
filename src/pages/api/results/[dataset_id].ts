import prisma from "@/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { dataset_id } = req.query;
      let datasetIdNumber: number | undefined;

      if (typeof dataset_id === "string") {
        datasetIdNumber = parseInt(dataset_id, 10);
      }

      if (datasetIdNumber === undefined || isNaN(datasetIdNumber)) {
        res.status(400).json({ error: "Invalid dataset_id provided." });
        return;
      }

      const results = await prisma.modelResults.findMany({
        where: {
          isActive: true,
          datasetId: datasetIdNumber,
        },
        orderBy: {
          id: "asc",
        },
      });

      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
