import { createServerFn } from "@tanstack/react-start";
import z from "zod";

// File upload demo: accepts a JSON payload with a base64 data URL
// Returns basic metadata and echoes a preview data URL for images
const uploadInput = z.object({
  filename: z.string().min(1),
  type: z.string().min(1),
  size: z.number().nonnegative(),
  fileBase64DataUrl: z
    .string()
    .min(1)
    .refine((s) => s.startsWith("data:"), "Expected a data URL"),
});

export const uploadProfileImage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => uploadInput.parse(data))
  .handler(async ({ data }) => {
    const { filename, type, size, fileBase64DataUrl } = data;
    const preview = type.startsWith("image/") ? fileBase64DataUrl : null;

    // Simulate storing the file; in a real app you would persist to S3/local disk/etc.
    return {
      ok: true,
      filename,
      size,
      type,
      previewDataUrl: preview,
    };
  });
