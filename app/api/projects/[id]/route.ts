import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const { id } = await ctx.params;
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed = [
    "slug", "title", "category", "type", "src", "poster", "orientation",
    "hasDescription", "description", "detailAutoplay", "planId", "planLabel", "sortOrder",
  ];

  const data: Record<string, any> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (typeof data.hasDescription !== "undefined") data.hasDescription = Boolean(data.hasDescription);
  if (typeof data.detailAutoplay !== "undefined") data.detailAutoplay = Boolean(data.detailAutoplay);
  if (typeof data.sortOrder !== "undefined") data.sortOrder = Number(data.sortOrder) || 0;

  try {
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(project);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const { id } = await ctx.params;
  try {
    await prisma.project.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete project" }, { status: 500 });
  }
}
