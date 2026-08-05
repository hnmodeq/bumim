import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { getProjects } from "@/lib/projects-data";

// Public list.
export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

// Protected create.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured." },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.slug || !body.title || !body.category || !body.type || !body.src) {
    return NextResponse.json(
      { error: "slug, title, category, type and src are required" },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.create({
      data: {
        slug: String(body.slug),
        title: String(body.title),
        category: String(body.category),
        type: String(body.type),
        src: String(body.src),
        poster: body.poster ?? "",
        orientation: body.orientation ?? "landscape",
        hasDescription: Boolean(body.hasDescription),
        description: body.description ?? "",
        detailAutoplay: Boolean(body.detailAutoplay),
        planId: body.planId ?? "",
        planLabel: body.planLabel ?? "",
        sortOrder: Number(body.sortOrder) || 0,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
