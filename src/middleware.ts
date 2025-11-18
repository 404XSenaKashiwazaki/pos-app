import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const currentUrl = request.nextUrl.pathname;
  const protedtedRoute = [
    "/",
    "/dashboard",
    "/pengaturan",
    "/users",
    "/pembayaran",
    "/pemesanan",
    "/produksi",
    "/harga-jenis",
    "/laporan",
  ];
  const userAuth = await auth();
  const role = userAuth?.user.role;

  if (!userAuth && protedtedRoute.includes(currentUrl)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", currentUrl);
    return NextResponse.redirect(loginUrl);
  }
  if (userAuth && currentUrl.startsWith("/login"))
    return NextResponse.redirect(new URL("/", request.url));


  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
