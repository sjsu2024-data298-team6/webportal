import prisma from "@/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const datasetsWithResults = await prisma.dataset.findMany({
        where: {
          modelResults: {
            some: {
              isActive: true,
            },
          },
        },
        select: {
          id: true,
          name: true,
          modelResults: {
            where: {
              isActive: true,
            },
            select: {
              id: true,
            },
          },
        },
      });

      const datasetWithResultsForDropdown = datasetsWithResults.map(
        (dataset) => ({
          value: dataset.id,
          name: `${dataset.name} (${dataset.modelResults.length} results)`,
        }),
      );

      res.status(200).json(datasetWithResultsForDropdown);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
