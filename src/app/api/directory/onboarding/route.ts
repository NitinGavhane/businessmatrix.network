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

    const userUpdateData: { name?: string; phone?: string } = {};
    if (data.ownerName || data.name) {
      userUpdateData.name = data.ownerName || data.name;
    }
    if (data.mobile) {
      const phoneOwner = await prisma.directoryUser.findFirst({
        where: { phone: data.mobile, id: { not: userId } },
      });
      if (phoneOwner) {
        return NextResponse.json({ error: "Phone number is already in use by another account" }, { status: 409 });
      }
      userUpdateData.phone = data.mobile;
    }

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.directoryUser.update({
        where: { id: userId },
        data: userUpdateData,
      });
    }

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
  } catch (error: any) {
    console.error("Onboarding error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "A unique constraint was violated. Please check your phone number." }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
