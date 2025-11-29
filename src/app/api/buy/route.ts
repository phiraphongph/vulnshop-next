import { NextResponse } from "next/server";
import { queryDB } from "@/utils/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  let productId = 0;
  let quantity = 0;
  let userId = 0;
  // ดึง user_id จาก cookie
  //   const cookieStore = await cookies();
  //   const userIdCookie = cookieStore.get("user_id");
  //   const userId = userIdCookie ? Number(userIdCookie.value) : 0;
  try {
    const body = await request.json();
    productId = typeof body.productId === "number" ? body.productId : 0;
    quantity = typeof body.quantity === "number" ? body.quantity : 0;
    // ดึง userId จาก body request ลบทิ้งถ้าอยากแก้ IDOR แต่น่าจะยังมี Cookie Tampering อยู่
    userId = typeof body.userId === "number" ? body.userId : 0;
  } catch (e) {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }
  if (productId <= 0 || quantity <= 0) {
    return NextResponse.json(
      { message: "Product ID and quantity must be positive numbers." },
      { status: 400 }
    );
  }
  try {
    const product = await queryDB(
      `SELECT * FROM products WHERE id = ${productId};`
    );
    const pricePerItem = product.rows.length ? product.rows[0].price : null;
    if (pricePerItem === null) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }
    const totalPrice = pricePerItem * quantity;

    const user = await queryDB(`SELECT * FROM users WHERE id = ${userId};`);
    const admin = await queryDB(`SELECT * FROM users WHERE id = 2;`);
    if (user.rows.length === 0) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    console.log(user.rows[0].balance);
    console.log(totalPrice);
    console.log(user.rows[0].username);
    if (user.rows[0].balance < totalPrice) {
      return NextResponse.json(
        { message: "จำนวนเงินไม่เพียงพอ" },
        { status: 400 }
      );
    } else {
      const newBalance = user.rows[0].balance - totalPrice;
      await queryDB(
        `UPDATE users SET balance = ${newBalance} WHERE id = ${userId};`
      );
      const currentAdminBalance = Number(admin.rows[0].balance);
      const newBalanceAdmin = currentAdminBalance + totalPrice;
      await queryDB(
        `UPDATE users SET balance = ${newBalanceAdmin} WHERE id = 2;`
      );
      return NextResponse.json(
        { message: "จ่ายเงินสำเร็จ", newBalance: newBalance },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing purchase:", error);
    return NextResponse.json(
      { message: "Error processing purchase." },
      { status: 500 }
    );
  }
}
