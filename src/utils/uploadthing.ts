import { generateUploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/server/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>();
