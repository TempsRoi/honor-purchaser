"use client";

import { useState } from "react";
import { processCharge } from "@/utils/stripe";
import type { JSX } from "react";

export default function ChargePage(): JSX.Element {
  const [amount, setAmount] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // 🔹 全角を半角に変換（日本語入力対策）
    value = value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));

    // 🔹 数字のみ許可（半角数字のみ）
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleCharge = async (): Promise<void> => {
    const chargeAmount = Number(amount); // 🔹 `string` → `number` に変換

    if (!chargeAmount || chargeAmount < 100) {
      alert("最低チャージ額は100円です。");
      return;
    }

    await processCharge(chargeAmount);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">チャージ</h1>
      <input
        type="text"
        value={amount}
        onChange={handleInputChange}
        placeholder="金額を入力"
        className="border rounded p-2 w-64 text-black placeholder-gray-500"
        inputMode="numeric" // 🔹 モバイルでも数字入力を促す
      />
      <button
        onClick={handleCharge}
        className="px-6 py-2 bg-green-500 text-white rounded-lg mt-4"
      >
        チャージする
      </button>
    </div>
  );
}
