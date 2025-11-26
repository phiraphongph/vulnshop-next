import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// กำหนด Path ที่ต้องการป้องกัน (ถ้าไม่ล็อกอิน ห้ามเข้า)
const protectedRoutes = ["/shop", "/transfer", "/product"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // ตรวจสอบว่าเป็นเส้นทางที่ต้องป้องกันหรือไม่
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const sessionToken = request.cookies.get("session_token")?.value;
    if (!sessionToken) {
      // ถ้าไม่มี session_token ให้รีไดเร็กต์ไปที่หน้า login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
