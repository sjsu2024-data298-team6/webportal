import prisma from "@/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const datasetLinks = await prisma.modelBaseType.findMany({
        where: {
          isActive: true,
        },
        select: {
          value: true,
          name: true,
        },
      });
      res.status(200).json(datasetLinks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
