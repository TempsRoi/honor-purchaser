"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { ref, onValue } from "firebase/database";

type RankingData = {
  name: string;
  total: number;
};

export default function RankingList() {
  const [ranking, setRanking] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rankingRef = ref(db, "ranking");

    const unsubscribe = onValue(rankingRef, (snapshot) => {
      const data = snapshot.val() || {};
      const sortedData = Object.values(data)
        .sort((a: any, b: any) => b.total - a.total)
        .slice(0, 10); // 🔹 上位10名を表示

      setRanking(sortedData as RankingData[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">🔥 ランキング 🔥</h2>

      {loading ? (
        <p className="text-center text-gray-500">ランキングを読み込み中...</p>
      ) : ranking.length === 0 ? (
        <p className="text-center text-gray-500">現在ランキングには誰もいません。</p>
      ) : (
        <ul>
          {ranking.map((user, index) => (
            <li
              key={index}
              className="border-b py-2 flex justify-between text-lg"
            >
              <span>{index + 1}位: {user.name}</span>
              <span className="font-bold">{user.total} 円</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
