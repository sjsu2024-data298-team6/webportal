import prisma from "@/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const results = await prisma.modelResults.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      //TODO: Update backend code to actually include the model name as a column
      const resultsWithName = results.map((r) => {
        return { ...r, modelName: r.id };
      });
      res.status(200).json(resultsWithName);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
