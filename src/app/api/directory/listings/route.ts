import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const profiles = await prisma.businessProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isPremium: true,
          },
        },
      },
      orderBy: { verified: "desc" },
    });

    const listings = profiles.map((p) => ({
      id: p.id,
      name: p.companyName,
      type: p.type,
      location: p.location || "Global",
      description: p.description || "",
      verified: p.verified,
      rating: 4.5,
      yearsActive: p.yearsActive || 3,
      tags: p.keyMarkets?.length ? p.keyMarkets : [p.category || "General"],
      color: getColor(p.type),
    }));

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Directory listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getColor(type: string): string {
  const colors: Record<string, string> = {
    Manufacturer: "from-indigo-500 to-indigo-700",
    "Wholesale Distributor": "from-emerald-500 to-emerald-700",
    Wholesaler: "from-emerald-500 to-emerald-700",
    Supplier: "from-amber-500 to-amber-600",
    Exporter: "from-rose-500 to-rose-700",
    "Service Provider": "from-sky-500 to-sky-700",
    Retailer: "from-violet-500 to-violet-700",
  };
  return colors[type] || "from-slate-500 to-slate-700";
}
