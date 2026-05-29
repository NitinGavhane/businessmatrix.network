import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    const where: Prisma.DirectoryUserWhereInput = { role: "USER" };

    if (search) {
      const term = `%${search}%`;
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        {
          profile: {
            companyName: { contains: search, mode: "insensitive" },
          },
        },
        {
          profile: {
            type: { contains: search, mode: "insensitive" },
          },
        },
        {
          profile: {
            location: { contains: search, mode: "insensitive" },
          },
        },
        {
          profile: {
            city: { contains: search, mode: "insensitive" },
          },
        },
        {
          profile: {
            country: { contains: search, mode: "insensitive" },
          },
        },
        {
          profile: {
            category: { contains: search, mode: "insensitive" },
          },
        },
        {
          profile: {
            ownerName: { contains: search, mode: "insensitive" },
          },
        },
        {
          profile: {
            description: { contains: search, mode: "insensitive" },
          },
        },
        {
          profile: {
            productsServices: { contains: search, mode: "insensitive" },
          },
        },
        {
          profile: {
            requirements: {
              some: {
                description: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
        {
          profile: {
            requirements: {
              some: {
                category: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
      ];
    }

    const users = await prisma.directoryUser.findMany({
      where,
      include: {
        profile: {
          include: {
            requirements: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
