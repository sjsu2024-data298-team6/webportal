import prisma from "@/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { model_id } = req.query;
      let modelIdNumber: number | undefined;

      if (typeof model_id === "string") {
        modelIdNumber = parseInt(model_id, 10);
      }

      if (modelIdNumber === undefined || isNaN(modelIdNumber)) {
        res.status(400).json({ error: "Invalid model_id provided." });
        return;
      }

      const results = await prisma.modelResults.findFirst({
        where: {
          isActive: true,
          id: modelIdNumber,
          tfjsS3Key: {
            not: undefined,
          },
        },
        orderBy: {
          id: "asc",
        },
        select: {
          tfjsS3Key: true,
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
