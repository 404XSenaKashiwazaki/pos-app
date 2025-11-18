import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Session } from "inspector/promises";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: ({ user, token, trigger, session }) => {
      if (user) {
        token.role = user.role;
        token.address = user.address;
        token.phone = user.phone;
        token.imageUrl = user.imageUrl;
        token.siteName = user.siteName;
        token.siteFileName = user.siteFileName;
        token.siteFileProofUrl = user.siteFileProofUrl;
      }
      if (trigger == "update" && session?.user) {
        token.role = session.user.role;
        token.address = session.user.address;
        token.phone = session.user.phone;
        token.name = session.user.name;
        token.imageUrl = session.user.imageUrl;
        token.siteName = session.user.siteName;
        token.siteFileName = session.user.siteFileName;
        token.siteFileProofUrl = session.user.siteFileProofUrl;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.role = token.role;
      session.user.id = token.sub;
      session.user.address = token.address;
      session.user.phone = token.phone;
      session.user.imageUrl = token.imageUrl;
      session.user.siteName = token.siteName;
      session.user.siteFileName = token.siteFileName;
      session.user.siteFileProofUrl = token.siteFileProofUrl;
      return session;
    },
  },
});
