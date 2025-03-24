import prisma from "@/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { model } = req.query;

      const datasets = await prisma.dataset.findMany({
        where: {
          datasetType: {
            modelBaseTypes: {
              some: {
                value: model as string
              }
            }
          }
        },
        select: {
          id: true,
          s3Key: true,
          links: true,
          tags: true
        }
      });

      // Log the results for debugging
      console.log("Found datasets:", datasets.length);
      console.log("First dataset:", datasets[0]);

      return res.status(200).json(datasets);
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({ error: "Failed to fetch datasets" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
