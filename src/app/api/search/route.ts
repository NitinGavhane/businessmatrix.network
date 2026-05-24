import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Fuse from "fuse.js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";

    const profiles = await prisma.businessProfile.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { verified: "desc" },
    });

    let listings = profiles.map((p) => ({
      id: p.id,
      name: p.companyName,
      type: p.type,
      location: p.location || "Global",
      description: p.description || "",
      verified: p.verified,
      tags: p.keyMarkets?.length ? p.keyMarkets : [p.category || "General"],
    }));

    if (type && type !== "All") {
      listings = listings.filter((l) => l.type.toLowerCase().includes(type.toLowerCase()));
    }

    if (query) {
      const fuse = new Fuse(listings, {
        keys: ["name", "description", "location", "type", "tags"],
        threshold: 0.4,
      });
      const results = fuse.search(query);
      listings = results.map((r) => r.item);
    }

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
