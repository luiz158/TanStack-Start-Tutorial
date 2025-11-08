import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadProfileImage } from "~/utils/file-upload-fn";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/file-upload")({
  head: () => ({
    meta: [{ title: "File Upload" }],
  }),
  component: FileUploadPage,
});

function FileUploadPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [clientPreview, setClientPreview] = React.useState<string | null>(null);
  const [serverPreview, setServerPreview] = React.useState<string | null>(null);
  const [meta, setMeta] = React.useState<{
    filename: string;
    size: number;
    type: string;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Select a file first");
      // Ensure we have a data URL available
      let dataUrl = clientPreview;
      if (!dataUrl) {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () =>
            reject(new Error("Failed to read file for upload"));
          reader.readAsDataURL(file);
        });
      }

      const res = await uploadProfileImage({
        data: {
          filename: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          fileBase64DataUrl: dataUrl,
        },
      });
      return res;
    },
    onSuccess: (res) => {
      setMeta({ filename: res.filename, size: res.size, type: res.type });
      setServerPreview(res.previewDataUrl || null);
    },
    onError: (err: unknown) => {
      setError((err as Error)?.message || "Upload failed");
    },
  });

  return (
    <div className="p-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Upload a profile image using a server function
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-sm text-red-600 mb-2">{error}</div>
          ) : null}
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                setServerPreview(null);
                setMeta(null);
                setError(null);
                if (f) {
                  const reader = new FileReader();
                  reader.onload = () => setClientPreview(String(reader.result));
                  reader.readAsDataURL(f);
                } else {
                  setClientPreview(null);
                }
              }}
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setError(null);
                  mutation.mutate();
                }}
                disabled={!file || mutation.isPending}
              >
                {mutation.isPending ? "Uploading…" : "Upload"}
              </Button>
              {mutation.isPending ? (
                <span className="text-xs text-gray-500">
                  Sending file to server…
                </span>
              ) : null}
            </div>

            {(clientPreview || serverPreview) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientPreview && (
                  <div>
                    <div className="font-semibold mb-1">Client Preview</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clientPreview}
                      alt="client preview"
                      className="max-w-xs rounded-md border"
                    />
                  </div>
                )}
                {serverPreview && (
                  <div>
                    <div className="font-semibold mb-1">Server Preview</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={serverPreview}
                      alt="server preview"
                      className="max-w-xs rounded-md border"
                    />
                  </div>
                )}
              </div>
            )}

            {meta && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div>Filename: {meta.filename}</div>
                <div>Type: {meta.type}</div>
                <div>Size: {meta.size} bytes</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
