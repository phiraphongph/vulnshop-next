"use client";
import React, { useEffect, useState } from "react";

// review type
interface Review {
  id: number;
  review_content: string; // **เปลี่ยน 'content' เป็น 'review_content'**
  product_id: number;
  reviewer_name: string;
}
export default function XssReviewPage() {
  const [newComment, setNewComment] = useState("");
  // จำลองการจัดเก็บรีวิว (ปกติจะอยู่ใน Database)
  const [comments, setComments] = useState<Review[]>([]);

  // ฟังก์ชันดึงรีวิวจากเซิร์ฟเวอร์ (API Route)

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/review");
      const data = await response.json();
      console.log("Fetched reviews:", data.reviews);
      setComments(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newComment.trim() === "") return;

    const reviewPaload = {
      content: newComment,
      name: "Test User",
      productId: 1,
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
    fetchReviews();
  };

  /**
   * 🔴 2. ฟังก์ชันแสดงผลที่มีช่องโหว่ XSS
   * React ไม่ได้ทำการ Encode Output ให้เมื่อใช้ dangerouslySetInnerHTML
   */
  const ReviewItem = ({ review }: { review: Review }) => (
    <div className="p-4 border border-gray-200 rounded-xl mb-3 bg-white shadow-sm">
      <p className="text-gray-600 mb-2 text-sm font-medium">
        รีวิว ID: {review.id}
      </p>

      {/* 💥 จุดอันตราย: dangerouslySetInnerHTML 💥
        Input ที่มีโค้ด Script จะถูกตีความเป็น HTML และถูกรัน
      */}
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
          🔥 Stored XSS Lab (ช่องโหว่รีวิว)
        </h1>
        <p className="text-gray-600 mb-6">
          สาธิตการโจมตี XSS เมื่อข้อมูลที่ผู้ใช้ป้อนถูกบันทึกและแสดงผลโดยไม่ได้
          Sanitize
        </p>

        {/* ---------------------------------------------------- */}
        {/* คำแนะนำ Payload */}
        {/* ---------------------------------------------------- */}
        <div className="p-4 mb-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow-md">
          <h3 className="font-bold text-lg mb-2">คำแนะนำ: วิธีทดสอบช่องโหว่</h3>
          <p className="mb-2">
            ลองวาง Payload ต่อไปนี้ลงในช่องรีวิวแล้วกด "ส่งรีวิว"
            จากนั้นดูผลลัพธ์:
          </p>
          <code className="block bg-yellow-200 p-2 rounded text-sm overflow-x-auto">
            &lt;img src=x onerror=alert("XSS-Stored-Executed")&gt;
          </code>
          <p className="mt-2 text-xs">
            (โค้ดนี้จะใช้ Tag &lt;img&gt; ที่มี Attribute onerror ซึ่งจะรัน
            JavaScript หากรูปภาพโหลดล้มเหลว)
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* ส่วนฟอร์มรีวิว */}
        {/* ---------------------------------------------------- */}
        <div className="p-6 bg-white rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ฝากรีวิวของคุณ
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="ป้อนรีวิว (รวมถึง Payload XSS ที่คุณต้องการทดสอบ)"
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

        {/* ---------------------------------------------------- */}
        {/* ส่วนแสดงผลรีวิวที่ถูกจัดเก็บ */}
        {/* ---------------------------------------------------- */}
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
