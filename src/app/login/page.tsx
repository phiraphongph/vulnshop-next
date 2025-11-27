"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// URL ของ API Login Backend (Next.js API route)
const LOGIN_API_URL = "/api/login";

/**
 * ฟังก์ชันสำหรับ Login Page (Frontend)
 * หน้าที่: รับ input จากผู้ใช้และส่งไปยัง Backend (route.ts)
 */
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // ข้อความแนะนำ Payload สำหรับการโจมตี
  const [message, setMessage] = useState(
    "กรุณา Login เพื่อเข้าสู่ระบบ (ลองใช้: admin, ' --)"
  );
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("กำลังตรวจสอบ...");
    setIsError(false);

    try {
      // ส่ง Username และ Password ไปยัง Backend (src/app/api/login/route.ts)
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      setMessage(data.message);
      if (response.ok) {
        // Login สำเร็จ (รวมถึงการ Bypass ด้วย Payload)
        setIsError(false);
        router.push("/shop");
      } else {
        // Login ล้มเหลว (401 Unauthorized หรือ 500 Internal Server Error)
        setIsError(true);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessage("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      {/* Title และ Meta tags จะถูกจัดการโดย Layout หลักของ Next.js */}

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-t-4 border-red-600">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          🛒 VulnShop Login
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Lab สำหรับทดสอบช่องโหว่ SQL Injection บน Next.js/PostgreSQL
        </p>

        {/* Message Box */}
        <div
          className={`p-4 mb-6 rounded-lg font-medium transition-all duration-300 ${
            message.includes("successful")
              ? "bg-green-100 text-green-800 border border-green-400"
              : isError
              ? "bg-red-100 text-red-800 border border-red-400"
              : "bg-blue-100 text-blue-800 border border-blue-400"
          }`}
        >
          {message}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Username (เป้าหมาย: admin)
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Password (Payload: ' or 1=1-- )
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
