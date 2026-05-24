import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const userProfile = await prisma.businessProfile.findUnique({
      where: { userId },
      include: { requirements: true },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "Complete your business profile first" }, { status: 400 });
    }

    const userAsks = userProfile.requirements.filter((r) => r.type === "ASK");
    const userGives = userProfile.requirements.filter((r) => r.type === "GIVE");

    const allProfiles = await prisma.businessProfile.findMany({
      where: { userId: { not: userId } },
      include: { requirements: true },
    });

    const matches = allProfiles.map((profile) => {
      let score = 0;
      const reasons: string[] = [];

      const theirGives = profile.requirements.filter((r) => r.type === "GIVE");
      const theirAsks = profile.requirements.filter((r) => r.type === "ASK");

      let giveMatch = false;
      for (const ask of userAsks) {
        for (const give of theirGives) {
          const askTags = new Set([ask.category, ...ask.tags].map((t) => t.toLowerCase()));
          const giveTags = new Set([give.category, ...give.tags].map((t) => t.toLowerCase()));
          const overlap = [...askTags].filter((t) => giveTags.has(t));
          if (overlap.length > 0) {
            score += 35 * overlap.length;
            giveMatch = true;
          }
        }
      }

      let askMatch = false;
      for (const give of userGives) {
        for (const ask of theirAsks) {
          const giveTags = new Set([give.category, ...give.tags].map((t) => t.toLowerCase()));
          const askTags = new Set([ask.category, ...ask.tags].map((t) => t.toLowerCase()));
          const overlap = [...giveTags].filter((t) => askTags.has(t));
          if (overlap.length > 0) {
            score += 35 * overlap.length;
            askMatch = true;
          }
        }
      }

      if (userProfile.country && profile.country && userProfile.country !== profile.country) {
        score += 10;
        reasons.push("Cross-border opportunity");
      }

      const sameCategory = userProfile.category && profile.category &&
        userProfile.category.toLowerCase() === profile.category.toLowerCase();
      if (sameCategory) {
        score += 15;
        reasons.push("Same industry category");
      }

      if (giveMatch && askMatch) {
        score += 20;
        reasons.push("Bidirectional match");
      }

      if (profile.verified) {
        score += 10;
        reasons.push("Verified business");
      }

      score = Math.min(score, 99);

      return {
        id: profile.id,
        companyName: profile.companyName,
        type: profile.type,
        location: profile.location || "Global",
        score: Math.max(score, 0),
        askDescription: profile.requirements.find((r) => r.type === "ASK")?.description || "",
        giveDescription: profile.requirements.find((r) => r.type === "GIVE")?.description || "",
        reasoning: reasons.length > 0 ? reasons.join(". ") + "." : "Potential synergy detected.",
      };
    });

    matches.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      matches: matches.slice(0, 20),
    });
  } catch (error) {
    console.error("Matchmaking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
