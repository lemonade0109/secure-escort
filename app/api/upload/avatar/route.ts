import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function sign(params: Record<string, string>, apiSecret: string) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(sorted + apiSecret)
    .digest("hex");
}

export async function POST(req: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary env vars missing." },
        { status: 500 },
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const timestamp = String(Math.floor(Date.now() / 1000));
    const folder = "secure-escort/avatars";

    const signature = sign({ folder, timestamp }, apiSecret);

    const upload = new FormData();
    upload.set("file", file);
    upload.set("api_key", apiKey);
    upload.set("timestamp", timestamp);
    upload.set("folder", folder);
    upload.set("signature", signature);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const res = await fetch(url, { method: "POST", body: upload });
    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: json?.error?.message ?? "Upload failed." },
        { status: 400 },
      );
    }

    return NextResponse.json({ url: json.secure_url }, { status: 200 });
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json(
      { error },
      { status: 500 },
    );
  }
  
}
