import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        token.alamat = user.alamat;
        token.no_hp = user.no_hp;
      }
      if (trigger == "update" && session?.user) {
        token.role = session.user.role;
        token.alamat = session.user.alamat;
        token.no_hp = session.user.no_hp;
        token.name = session.user.name;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.role = token.role;
      session.user.id = token.sub;
      session.user.alamat = token.alamat;
      session.user.no_hp = token.no_hp;
      return session;
    },
  },
});
