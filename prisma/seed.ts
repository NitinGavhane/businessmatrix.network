import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.directoryUser.create({
    data: {
      name: "Admin",
      email: "admin@businessmatrix.network",
      passwordHash,
      role: "ADMIN",
      isPremium: true,
    },
  });

  const testHash = await bcrypt.hash("test123", 10);
  const testUser = await prisma.directoryUser.create({
    data: {
      name: "Test User",
      email: "test@test.com",
      passwordHash: testHash,
      role: "USER",
      isPremium: false,
    },
  });

  const user1 = await prisma.directoryUser.create({
    data: {
      name: "Raj Patel",
      email: "raj@sunrise-electronics.com",
      passwordHash,
      role: "USER",
      isPremium: true,
    },
  });

  const user2 = await prisma.directoryUser.create({
    data: {
      name: "Amit Sharma",
      email: "amit@mumbaitradehub.com",
      passwordHash,
      role: "USER",
      isPremium: false,
    },
  });

  const user3 = await prisma.directoryUser.create({
    data: {
      name: "Sarah Chen",
      email: "sarah@globalfit.com",
      passwordHash,
      role: "USER",
      isPremium: true,
    },
  });

  const profile1 = await prisma.businessProfile.create({
    data: {
      userId: user1.id,
      companyName: "Sunrise Electronics Co.",
      type: "Manufacturer",
      description: "Leading OEM/ODM electronics manufacturer with 15+ years of experience. Specializing in smart home devices, IoT solutions, and consumer electronics.",
      location: "Shenzhen, China",
      city: "Shenzhen",
      country: "China",
      verified: true,
      category: "Electronics",
      yearsActive: 15,
      scale: "Large",
      turnover: "$10M+",
      keyMarkets: ["North America", "Europe", "Asia"],
      productsServices: "Smart home devices, IoT solutions, consumer electronics OEM/ODM",
      buyingProducts: ["Electronic Components", "Semiconductors", "Packaging"],
      sellingProducts: ["Smart Home Devices", "IoT Modules", "Consumer Electronics"],
    },
  });

  const profile2 = await prisma.businessProfile.create({
    data: {
      userId: user2.id,
      companyName: "Mumbai Trade Hub",
      type: "Wholesale Distributor",
      description: "Premium FMCG distributor serving 500+ retail chains across India. Specializing in imported and domestic food products.",
      location: "Mumbai, India",
      city: "Mumbai",
      country: "India",
      verified: true,
      category: "FMCG",
      yearsActive: 8,
      scale: "Medium",
      turnover: "$1M - $10M",
      keyMarkets: ["India", "Middle East"],
      productsServices: "FMCG distribution, import/export, retail supply chain",
      buyingProducts: ["Imported Foods", "Beverages", "Packaged Goods"],
      sellingProducts: ["Distribution Services", "Retail Supply", "Warehousing"],
    },
  });

  const profile3 = await prisma.businessProfile.create({
    data: {
      userId: user3.id,
      companyName: "GlobalFit Supplies",
      type: "Wholesaler",
      description: "End-to-end fitness equipment supplier for commercial and home gyms. Authorized dealer of top international brands.",
      location: "Dubai, UAE",
      city: "Dubai",
      country: "UAE",
      verified: true,
      category: "Fitness",
      yearsActive: 6,
      scale: "Medium",
      turnover: "$1M - $10M",
      keyMarkets: ["Middle East", "Africa", "Europe"],
      productsServices: "Fitness equipment supply, gym setup consulting, maintenance services",
      buyingProducts: ["Cardio Machines", "Free Weights", "Gym Accessories"],
      sellingProducts: ["Commercial Gym Equipment", "Home Gym Solutions", "Fitness Accessories"],
    },
  });

  await prisma.requirement.createMany({
    data: [
      { profileId: profile1.id, type: "GIVE", category: "Electronics", description: "OEM/ODM manufacturing services for smart home and IoT devices. EU certification available.", tags: ["OEM", "ODM", "Smart Home", "IoT"], isActive: true },
      { profileId: profile1.id, type: "ASK", category: "Electronics", description: "Looking for reliable semiconductor suppliers for our smart home product line.", tags: ["Semiconductors", "Components", "Sourcing"], isActive: true },
      { profileId: profile2.id, type: "GIVE", category: "FMCG", description: "Distribution network across India for FMCG products. 500+ retail partners.", tags: ["Distribution", "Retail", "India"], isActive: true },
      { profileId: profile2.id, type: "ASK", category: "FMCG", description: "Seeking international food and beverage brands for Indian market distribution.", tags: ["Import", "FMCG", "Beverages"], isActive: true },
      { profileId: profile3.id, type: "GIVE", category: "Fitness", description: "Commercial and home fitness equipment supply with installation and maintenance.", tags: ["Equipment", "Installation", "Maintenance"], isActive: true },
      { profileId: profile3.id, type: "ASK", category: "Fitness", description: "Need eco-friendly fitness product manufacturers for exclusive Middle East distribution.", tags: ["Eco-friendly", "Manufacturing", "Distribution"], isActive: true },
    ],
  });

  const reqs = await prisma.requirement.findMany();
  if (reqs.length >= 4) {
    await prisma.match.createMany({
      data: [
        { askerId: profile1.id, giverId: profile3.id, score: 92, status: "PENDING" },
        { askerId: profile2.id, giverId: profile1.id, score: 85, status: "PENDING" },
      ],
    });
  }

  console.log("✅ Seed data created successfully!");
  console.log("   Admin: admin@businessmatrix.network / admin123");
  console.log("   Test:  test@test.com / test123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
