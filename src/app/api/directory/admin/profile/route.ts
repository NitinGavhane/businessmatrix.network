import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.directoryUser.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await req.json();
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;

    if (data.currentPassword && data.newPassword) {
      const user = await prisma.directoryUser.findUnique({ where: { id: userId } });
      if (user?.passwordHash) {
        const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
        if (!isValid) {
          return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }
        updateData.passwordHash = await bcrypt.hash(data.newPassword, 10);
      }
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.directoryUser.update({ where: { id: userId }, data: updateData });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
