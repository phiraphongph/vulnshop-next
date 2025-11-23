import { NextResponse } from "next/server";
import { queryDB } from "@/utils/db";

export async function GET() {
  try {
    const products = await queryDB("SELECT * FROM products ORDER BY id ASC");
    return NextResponse.json({ products: products.rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const content = typeof body.content === "string" ? body.content : "";
  const name = typeof body.name === "string" ? body.name : "";
  const productId = typeof body.productId === "number" ? body.productId : 0;
  if (!content || !name || !productId) {
    return NextResponse.json(
      { message: "Missing required fields." },
      { status: 400 }
    );
  }
  try {
    const insertQuery = `INSERT INTO reviews (product_id, review_content, reviewer_name) VALUES (${productId}, '${content}', '${name}') RETURNING *;`;
    console.log("VULNERABLE INSERT QUERY:", insertQuery);
    const result = await queryDB(insertQuery);
    return NextResponse.json(
      { message: "Review added successfully.", review: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { message: "Error adding review." },
      { status: 500 }
    );
  }
}
