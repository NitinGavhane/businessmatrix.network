import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await req.json();

    const existing = await prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      return NextResponse.json({ error: "Business profile already exists. Edit it instead." }, { status: 409 });
    }

    await prisma.directoryUser.update({
      where: { id: userId },
      data: {
        name: data.contactPerson || data.businessName,
        phone: data.phone || undefined,
      },
    });

    const profile = await prisma.businessProfile.create({
      data: {
        userId,
        companyName: data.businessName,
        type: Array.isArray(data.businessType) ? data.businessType.join(", ") : data.businessType,
        description: data.description || null,
        location: [data.city, data.country].filter(Boolean).join(", ") || null,
        address: data.address || null,
        city: data.city || null,
        country: data.country || null,
        website: data.website || null,
        contactPerson: data.contactPerson || null,
        productsServices: data.productsServices || null,
        scale: data.scale || null,
        turnover: data.turnover || null,
        yearsActive: data.yearsActive ? parseInt(data.yearsActive) : null,
        keyMarkets: data.keyMarkets ? data.keyMarkets.split(",").map((m: string) => m.trim()) : [],
        certifications: [],
        verified: false,
      },
    });

    if (data.whatYouOffer) {
      await prisma.requirement.create({
        data: {
          profileId: profile.id,
          type: "GIVE",
          category: data.category || "General",
          description: data.whatYouOffer,
          tags: data.partnershipTypes || [],
        },
      });
    }

    if (data.whatYouNeed) {
      await prisma.requirement.create({
        data: {
          profileId: profile.id,
          type: "ASK",
          category: data.category || "General",
          description: data.whatYouNeed,
          tags: data.partnershipTypes || [],
        },
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("List business error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
