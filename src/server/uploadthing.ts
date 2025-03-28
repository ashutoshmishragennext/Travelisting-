import { randomUUID } from "crypto";

import { createUploadthing, UTFiles } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  videoAndImage: f({
    image: {
      maxFileSize: "32MB",
      maxFileCount: 4,
      acl: "public-read",
    },
    video: {
      maxFileSize: "16MB",
    },
    blob: {
      maxFileSize: "8GB",
    },
  })
    .middleware(({ req, files }) => {
      // Check some condition based on the incoming requrest
      console.log("Request", req);
      //^?
      // if (!req.headers.get("x-some-header")) {
      //   throw new Error("x-some-header is required");
      // }

      // (Optional) Label your files with a custom identifier
      const filesWithMyIds = files.map((file, idx) => ({
        ...file,
        customId: `${idx}-${randomUUID()}`,
      }));

      // Return some metadata to be stored with the file
      return { foo: "bar" as const, [UTFiles]: filesWithMyIds };
    })
    .onUploadComplete(({ file, metadata }) => {
      metadata;
      // ^?
      file.customId;
      //   ^?
      console.log("upload completed", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
