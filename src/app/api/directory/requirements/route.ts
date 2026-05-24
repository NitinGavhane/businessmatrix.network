import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const requirements = await prisma.requirement.findMany({
      where: { profile: { userId } },
      include: {
        profile: { select: { companyName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requirements });
  } catch (error) {
    console.error("Requirements error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await req.json();

    const profile = await prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Complete your business profile first" }, { status: 400 });
    }

    const requirement = await prisma.requirement.create({
      data: {
        profileId: profile.id,
        type: data.type || "ASK",
        category: data.category || "General",
        description: data.description,
        tags: data.tags || [],
      },
    });

    return NextResponse.json({ success: true, requirement });
  } catch (error) {
    console.error("Create requirement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
