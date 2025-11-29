// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { queryDB } from "@/utils/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  let username = "";
  let password = "";

  try {
    const body = await request.json();
    username = typeof body.username === "string" ? body.username : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch (e) {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 }
    );
  }

  // intentionally vulnerable
  const queryText = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}';`;

  // Log the raw query so the student can see it
  console.log("VULNERABLE QUERY:", queryText);

  try {
    // Run the vulnerable query
    const result = await queryDB(queryText);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      // เตรียมตัวแปร response ไว้ก่อน (ยังไม่ return)
      const response = NextResponse.json(
        {
          message:
            result.rowCount > 0 ? "Login matched rows" : "No rows matched",
          executedQuery: queryText,
          rowCount: result.rowCount,
          rows: result.rows,
        },
        { status: result.rowCount > 0 ? 200 : 401 }
      );

      response.cookies.set("session_token", user.username, {
        httpOnly: false,
        secure: false,
        path: "/",
        sameSite: "lax",
      });

      response.cookies.set("user_id", String(user.id), {
        httpOnly: false,
        secure: false,
        path: "/",
        sameSite: "lax",
      });

      response.cookies.set("is_admin", String(user.is_admin), {
        httpOnly: false,
        secure: false,
        path: "/",
        sameSite: "lax",
      });

      console.log(`[LOGIN SUCCESS] Cookie set for user: ${user.username}`);
      // Return response ที่เรายัด Cookie ใส่ไปแล้ว
      return response;
    } else {
      return NextResponse.json(
        {
          message: "Invalid username or password.",
          executedQuery: queryText,
          rowCount: result.rowCount,
          rows: result.rows,
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    // Return DB error details for debugging (again: lab only)
    console.error("Database error during query execution:", error);
    return NextResponse.json(
      {
        message: "Database error",
        executedQuery: queryText,
        error:
          typeof error === "object"
            ? String(error.message || error)
            : String(error),
      },
      { status: 500 }
    );
  }
}
