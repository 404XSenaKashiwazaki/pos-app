import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const currentUrl = request.nextUrl.pathname;
  console.log({ nextURL : request.nextUrl});
  
  const protedtedRoute = ["/", "/dashboard", "/pengaturan", "/users", "/pembayaran","/pemesanan","/produksi","/harga-jenis","/laporan"];
  const isLogin = await auth();

  if (!isLogin && protedtedRoute.includes(currentUrl)) {
  
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", currentUrl); 
    return NextResponse.redirect(loginUrl);
  }
  if (isLogin && currentUrl.startsWith("/login"))
    return NextResponse.redirect(new URL("/", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
