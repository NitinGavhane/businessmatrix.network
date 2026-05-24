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
      return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
    }

    await prisma.directoryUser.update({
      where: { id: userId },
      data: {
        name: data.ownerName || data.name,
        phone: data.mobile || undefined,
      },
    });

    const profile = await prisma.businessProfile.create({
      data: {
        userId,
        companyName: data.businessName,
        type: data.businessType || "Manufacturer",
        description: data.description || null,
        location: [data.city, data.state, data.country].filter(Boolean).join(", ") || null,
        ownerName: data.ownerName || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || null,
        category: data.category || null,
        buyingProducts: data.buyingProducts?.filter(Boolean) || [],
        sellingProducts: data.sellingProducts?.filter(Boolean) || [],
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
