import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalUsers, totalProfiles, totalRequirements, totalMatches] = await Promise.all([
      prisma.directoryUser.count({ where: { role: "USER" } }),
      prisma.businessProfile.count(),
      prisma.requirement.count(),
      prisma.match.count(),
    ]);

    const byType = await prisma.businessProfile.groupBy({
      by: ["type"],
      _count: true,
    });

    return NextResponse.json({
      totalUsers,
      totalProfiles,
      totalRequirements,
      totalMatches,
      byType,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
