import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role?: string | null;
    alamat?: string | null;
    no_hp?: string | null;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    alamat?: string | null;
    no_hp?: string | null;
    sub: string;
  }
}
