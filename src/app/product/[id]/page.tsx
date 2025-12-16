"use client";
import React, { useEffect, useState, use } from "react";
// type
interface Review {
  id: number;
  review_content: string;
  product_id: number;
  reviewer_name: string;
}
interface Product {
  id: number;
  product_name: string;
  price: number;
}
export default function XssReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = parseInt(id, 10);
  const [newComment, setNewComment] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Review[]>([]);

  //ฟังก์ชันช่วยอ่าน Cookie ในฝั่ง Client
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null; // กัน Error ตอน Server Render
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  // ฟังก์ชันดึงรีวิวจากเซิร์ฟเวอร์ (API Route)

  const fetchData = async () => {
    try {
      const response = await fetch("/api/review");
      const data = await response.json();
      const productReviews = data.reviews.filter(
        (review: Review) => review.product_id === productId
      );
      setComments(productReviews);
      console.log("Fetched reviews:", productReviews);

      const productResponse = await fetch("/api/product");
      const productData = await productResponse.json();
      const currentProduct = productData.products.find(
        (p: Product) => p.id === productId
      );
      setProduct(currentProduct);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuy = async () => {
    const cookieUserId = getCookie("user_id");
    console.log("Cookie user_id:", cookieUserId);
    const userIdToSend = cookieUserId ? parseInt(cookieUserId) : 0;
    console.log("User ID to send:", userIdToSend);

    try {
      const purchasePayload = {
        productId: productId,
        quantity: 1,
        userId: userIdToSend, // ส่ง userId ไปด้วย
      };
      const response = await fetch("/api/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchasePayload),
      });
      const data = await response.json();
      console.log("Response from server:", data);
      alert("ซื้อสินค้าสำเร็จ!,data=" + JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newComment.trim() === "") return;

    const reviewPaload = {
      content: newComment,
      name: "Test User",
      productId: productId,
    };
    try {
      const response = fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewPaload),
      });
      const data = response.then((res) => res.json());
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error:", error);
    }
    if (newComment.trim() === "") return;
    setNewComment("");
    // ดึงรีวิวใหม่หลังจากเพิ่มรีวิวสำเร็จ
    fetchData();
  };

  const ReviewItem = ({ review }: { review: Review }) => (
    <div className="p-4 border border-gray-200 rounded-xl mb-3 bg-white shadow-sm">
      <p className="text-gray-600 mb-2 text-sm font-medium">
        {review.reviewer_name}
      </p>
      {/* XSS */}
      <div
        className="text-gray-800 text-lg"
        dangerouslySetInnerHTML={{ __html: review.review_content }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-red-700 mb-2">
          {product ? ` ${product.product_name}` : ""}
        </h1>
        <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
          <img
            src={`https://picsum.photos/400/300?random=${productId}`}
            alt="Placeholder"
            className="w-full h-32 object-contain bg-gray-100 rounded-md mb-2"
          />
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              {product ? ` ${product.product_name}` : ""}
            </h1>
            <p className="text-gray-500 mb-4">รหัสสินค้า: {productId}</p>
            <div className="text-green-600 font-bold text-xl">
              ฿ {product?.price}
            </div>
            <button
              onClick={handleBuy}
              type="button"
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              ซื้อเลย
            </button>
          </div>
        </div>

        {/* Payload */}
        <div className="p-4 mb-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow-md">
          <h3 className="font-bold text-lg mb-2">Payload</h3>
          <code className="block bg-yellow-200 p-2 rounded text-sm overflow-x-auto">
            &lt;img src=x onerror=alert("XSS-Stored-Executed")&gt;
          </code>
        </div>

        {/* form */}
        <div className="p-6 bg-white rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ฝากรีวิวของคุณ
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="ป้อนรีวิว ของคุณที่นี่..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150 text-gray-700"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-200 transform hover:scale-[1.005]"
            >
              ส่งรีวิว
            </button>
          </form>
        </div>

        {/* review */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          รีวิวทั้งหมด ({comments.length} รายการ)
        </h2>
        <div className="space-y-4">
          {comments
            .slice()
            .reverse()
            .map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
        </div>
      </div>
    </div>
  );
}
