import { NextResponse } from "next/server";
import { queryDB } from "@/utils/db";

export async function POST(request: Request) {
  let fromAccount = "";
  let toAccount = "";
  let amount = 0;
  try {
    const body = await request.json();
    fromAccount = typeof body.fromAccount === "string" ? body.fromAccount : "";
    toAccount = typeof body.toAccount === "string" ? body.toAccount : "";
    amount = typeof body.amount === "number" ? body.amount : 0;
  } catch (e) {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }
  if (!fromAccount || !toAccount || amount <= 0) {
    return NextResponse.json(
      { message: "All fields are required and amount must be positive." },
      { status: 400 }
    );
  }
  // intentionally vulnerable
  const queryText = `UPDATE accounts SET balance = balance - ${amount} WHERE account_number = '${fromAccount}'; UPDATE accounts SET balance = balance + ${amount} WHERE account_number = '${toAccount}';`;
  console.log("VULNERABLE TRANSFER QUERY:", queryText);
  try {
    // Run the vulnerable query
    await queryDB(queryText);
    return NextResponse.json(
      { message: "Transfer completed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing transfer:", error);
    return NextResponse.json(
      { message: "Error processing transfer." },
      { status: 500 }
    );
  }
}
