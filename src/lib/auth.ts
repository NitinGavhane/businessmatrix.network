import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function checkAndDowngradePremium(userId: string) {
  const user = await prisma.directoryUser.findUnique({
    where: { id: userId },
    select: { isPremium: true, premiumExpiresAt: true },
  });
  if (user?.isPremium && user.premiumExpiresAt && user.premiumExpiresAt < new Date()) {
    await prisma.directoryUser.update({
      where: { id: userId },
      data: { isPremium: false, premiumExpiresAt: null },
    });
    return false;
  }
  return user?.isPremium ?? false;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/directory/auth/login",
    error: "/directory/auth/login",
    newUser: "/directory/onboarding",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.directoryUser.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        const isPremium = await checkAndDowngradePremium(user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          isPremium,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isPremium = (user as any).isPremium;
        token.role = (user as any).role;
      }
      if (token.id) {
        const isPremium = await checkAndDowngradePremium(token.id as string);
        token.isPremium = isPremium;
      }
      if (trigger === "update" && session?.isPremium !== undefined) {
        token.isPremium = session.isPremium;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isPremium = token.isPremium;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
