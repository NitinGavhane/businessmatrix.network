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

    const [user, profileViews, matchesCount, requirements] = await Promise.all([
      prisma.directoryUser.findUnique({
        where: { id: userId },
        include: { profile: true },
      }),
      prisma.match.count({
        where: {
          OR: [
            { asker: { userId } },
            { giver: { userId } },
          ],
        },
      }),
      prisma.match.count({
        where: {
          status: "PENDING",
          OR: [
            { asker: { userId } },
            { giver: { userId } },
          ],
        },
      }),
      prisma.requirement.findMany({
        where: { profile: { userId } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const activeReqs = requirements
      .filter((r) => r.isActive)
      .map((r) => ({
        id: r.id,
        type: r.type === "GIVE" ? "Give" : "Ask",
        title: r.description.slice(0, 80),
        description: r.description,
        category: r.category,
      }));

    return NextResponse.json({
      profileViews,
      newMatches: matchesCount,
      activeRequirements: activeReqs,
      user: {
        name: user?.name,
        companyName: user?.profile?.companyName,
        isPremium: user?.isPremium,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
