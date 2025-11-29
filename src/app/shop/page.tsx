"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// type from "next/link";
interface Product {
  id: number;
  product_name: string;
  price: number;
}

// 1. ย้าย Component ย่อยออกมาข้างนอก (Performance)
const ProductItem = ({ product }: { product: Product }) => (
  <Link href={`/product/${product.id}`} className="w-full">
    <div className="p-4 border border-gray-200 rounded-xl mb-3 bg-white shadow-sm">
      <p className="text-gray-600 mb-2 text-sm font-medium">
        {/* 2. แก้ไขการแสดงผลให้ถูกต้อง (Logic) */}
        สินค้า ID: {product.id} <br />
        ชื่อสินค้า: {product.product_name} <br />
        ราคา: {product.price} บาท
      </p>
      <img
        src={`https://picsum.photos/400/300?random=${product.id}`}
        alt="Placeholder"
        className="w-full h-32 object-contain bg-gray-100 rounded-md mb-2"
      />
    </div>
  </Link>
);

export default function ShopPage() {
  // 3. เปลี่ยนชื่อ setProduct เป็น setProducts (Naming Convention)
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProduct = async () => {
    try {
      const response = await fetch("/api/product");
      const data = await response.json();

      console.log("Fetched products:", data.products);

      // 4. ป้องกัน Error ถ้า data.products ไม่มีค่า (Safety)
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold text-red-700 mb-2 ">
          🛒 ร้านค้า Vulnerable Shop
        </h1>

        <div className="w-full">
          {/* แสดงรายการสินค้า */}
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
