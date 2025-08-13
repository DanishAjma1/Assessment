import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3Bucket.js";

export async function generateDownloadUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key
  });
  return await getSignedUrl(s3, command, { expiresIn: 60 });
}
