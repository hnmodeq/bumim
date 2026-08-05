import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToBucket } from "@/lib/supabase";
import path from "path";

// Protected media upload to Supabase Storage.
// Accepts multipart/form-data with a `file` field and optional `folder`.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const folder = String(form.get("folder") || "uploads");
    const safeFolder = folder.replace(/[^\w\-/]/g, "");

    // Sanitize + uniquify filename
    const ext = path.extname(file.name).toLowerCase();
    const base = path
      .basename(file.name, ext)
      .replace(/[^\w\-]/g, "-")
      .toLowerCase();
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const storagePath = `${safeFolder}/${unique}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, path: savedPath } = await uploadToBucket(
      buffer,
      storagePath,
      file.type || "application/octet-stream"
    );

    return NextResponse.json({ url, path: savedPath });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
