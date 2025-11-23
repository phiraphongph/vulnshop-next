"use client";
import React, { useState } from "react";

/** ฟังก์ชันสำหรับหน้าโอนเงิน (Transfer Page)
 * หน้าที่: รับ input จากผู้ใช้และแสดงผลลัพธ์การโอนเงิน
 */
export default function TransferPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-100 items-center justify-center">
      <h1 className="text-4xl font-extrabold text-gray-800">
        💸 Transfer Page (ยังไม่สมบูรณ์)
      </h1>
      <form
        className="mt-6 bg-white p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="form-group mb-4">
          <label htmlFor="recipientAccountNumber" className="text-black">
            Recipient Account Number:
          </label>
          <input
            type="text"
            id="recipientAccountNumber"
            className="form-control border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="moneyAmount" className="text-black">
            money Amount:
          </label>
          <input
            type="text"
            id="recipientAccountNumber"
            className="form-control border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="pin" className="text-black">
            PIN:
          </label>
          <input
            type="password"
            id="pin"
            className="form-control border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
