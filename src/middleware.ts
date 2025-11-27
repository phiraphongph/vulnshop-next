import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// กำหนด Path ที่ต้องการป้องกัน (ถ้าไม่ล็อกอิน ห้ามเข้า)
const protectedRoutes = ["/shop", "/transfer", "/product"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (isProtectedRoute) {
    const sessionToken = request.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Config เพื่อระบุว่า Middleware นี้จะทำงานที่ Path ไหนบ้าง
// (ใส่ matcher เพื่อไม่ให้มันทำงานกับไฟล์ static, image, หรือ api ที่ไม่จำเป็น)
// export const config = {
//   matcher: [
//     '/shop/:path*',
//     '/transfer/:path*',
//     '/product/:path*',
//     '/login'
//   ],
// }
