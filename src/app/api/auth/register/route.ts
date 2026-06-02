import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existing = await prisma.directoryUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    if (phone) {
      const phoneOwner = await prisma.directoryUser.findFirst({ where: { phone } });
      if (phoneOwner) {
        return NextResponse.json({ error: "You can not use already registered phone number" }, { status: 409 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.directoryUser.create({
      data: {
        name: name || null,
        email,
        phone: phone || null,
        passwordHash,
        role: "USER",
        isPremium: false,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error?.code?.startsWith?.("P")) {
      return NextResponse.json({ error: "Database connection error. Please try again later." }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
