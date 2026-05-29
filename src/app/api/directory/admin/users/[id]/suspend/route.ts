import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.directoryUser.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updated = await prisma.directoryUser.update({
      where: { id },
      data: { suspended: !user.suspended },
      select: { id: true, suspended: true },
    });

    return NextResponse.json({ success: true, suspended: updated.suspended });
  } catch (error) {
    console.error("Suspend error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
