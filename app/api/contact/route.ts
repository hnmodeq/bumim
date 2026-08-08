import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = clean(body.name);
  const phone = clean(body.phone);
  const email = clean(body.email);
  const subject = clean(body.subject);
  const message = clean(body.message);
  const website = clean(body.website);

  if (website) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!/^09\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "Valid phone is required" }, { status: 400 });
  }

  if (!subject || subject.length < 3) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }

  if (!message || message.length < 10) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  try {
    const submission = await prisma.contactSubmission.create({
      data: { name, phone, email, subject, message },
    });
    return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to save contact submission" },
      { status: 500 }
    );
  }
}
