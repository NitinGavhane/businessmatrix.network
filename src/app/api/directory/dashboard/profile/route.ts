import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await prisma.directoryUser.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        isPremium: user.isPremium,
        role: user.role,
      },
      businessProfile: user.profile,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await req.json();

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.image !== undefined) updateData.image = data.image;

    if (data.currentPassword && data.newPassword) {
      const user = await prisma.directoryUser.findUnique({ where: { id: userId } });
      if (!user?.passwordHash) {
        return NextResponse.json({ error: "No password set on this account" }, { status: 400 });
      }
      const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      updateData.passwordHash = await bcrypt.hash(data.newPassword, 10);
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.directoryUser.update({
        where: { id: userId },
        data: updateData,
      });
    }

    const businessFields = [
      "companyName", "type", "description", "location", "ownerName",
      "address", "city", "state", "country", "category", "website",
      "contactPerson", "yearsActive", "turnover", "scale", "keyMarkets",
      "certifications", "productsServices", "buyingProducts", "sellingProducts",
      "logoUrl", "bannerUrl",
    ];

    const businessData: any = {};
    let hasBusinessData = false;
    for (const field of businessFields) {
      if (data[field] !== undefined) {
        businessData[field] = data[field];
        hasBusinessData = true;
      }
    }

    if (hasBusinessData) {
      const existing = await prisma.businessProfile.findUnique({ where: { userId } });
      if (existing) {
        await prisma.businessProfile.update({
          where: { userId },
          data: businessData,
        });
      } else {
        await prisma.businessProfile.create({
          data: {
            userId,
            companyName: businessData.companyName || data.name || "My Company",
            type: businessData.type || "Manufacturer",
            ...businessData,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
