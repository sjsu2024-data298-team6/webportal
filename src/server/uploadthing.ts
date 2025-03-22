import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

export const ourFileRouter = {
  yamlFileUploader: f({
    "application/yaml": {
      maxFileSize: "8KB",
      maxFileCount: 1,
      minFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    console.log("file url", file.ufsUrl);
    return { uploadedBy: true };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
