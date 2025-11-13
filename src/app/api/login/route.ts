// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { queryDB } from "@/utils/db";

/**
 * Vulnerable login API for vulnshop (DEMO only)
 * - Intentionally vulnerable to SQLi (string concatenation)
 * - Returns the executed query and DB results/errors to help demo and debug
 *
 * IMPORTANT: Use only in a controlled lab environment.
 */
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

    // Return detailed info for demo: the raw query and rows
    return NextResponse.json(
      {
        message: result.rowCount > 0 ? "Login matched rows" : "No rows matched",
        executedQuery: queryText,
        rowCount: result.rowCount,
        rows: result.rows, // 🔥 exposes DB rows — OK only in lab
      },
      { status: result.rowCount > 0 ? 200 : 401 }
    );
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
