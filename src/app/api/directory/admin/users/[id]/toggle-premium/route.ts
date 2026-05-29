import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const durationMap: Record<string, number> = {
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const duration = body.duration as string | undefined;

    const user = await prisma.directoryUser.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let isPremium: boolean;
    let premiumExpiresAt: Date | null = null;

    if (user.isPremium) {
      isPremium = false;
    } else {
      isPremium = true;
      if (duration && durationMap[duration]) {
        const expires = new Date();
        expires.setDate(expires.getDate() + durationMap[duration]);
        premiumExpiresAt = expires;
      }
    }

    const updated = await prisma.directoryUser.update({
      where: { id },
      data: { isPremium, premiumExpiresAt },
      select: { id: true, isPremium: true, premiumExpiresAt: true },
    });

    return NextResponse.json({
      success: true,
      isPremium: updated.isPremium,
      premiumExpiresAt: updated.premiumExpiresAt,
    });
  } catch (error) {
    console.error("Toggle premium error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
