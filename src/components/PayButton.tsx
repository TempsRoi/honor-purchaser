"use client";

import { useState, useEffect } from "react";
import { processPayment } from "@/utils/stripe";
import { auth, db } from "@/utils/firebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
import { ref, onValue } from "firebase/database";

export default function PayButton(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const balanceRef = ref(db, `users/${currentUser.uid}/balance`);
        onValue(balanceRef, (snapshot) => {
          const val = snapshot.val();
          setBalance(typeof val === "number" ? val : 0);
        });
      }
    });

    return () => unsubscribe(); // 🔹 クリーンアップ
  }, []);

  const handlePayment = async (): Promise<void> => {
    if (!user) return;

    if (balance < 1) {
      alert("残高が足りません。チャージしてください。");
      return;
    }

    try {
      await processPayment(user.uid, 1);
      alert("1円支払い完了！");
    } catch (error) {
      console.error("支払いエラー:", error);
      alert("支払いに失敗しました。");
    }
  };

  const handleLogin = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログインに失敗しました。");
    }
  };

  return (
    <div className="text-center">
      {user ? (
        <>
          <p>残高: {balance}円</p>
          <button
            onClick={handlePayment}
            disabled={balance < 1}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg mt-4"
          >
            1円支払う
          </button>
          <button
            onClick={() => (window.location.href = "/charge")}
            className="px-6 py-2 bg-green-500 text-white rounded-lg mt-4 ml-2"
          >
            チャージ
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg mt-4"
        >
          Googleでログイン
        </button>
      )}
    </div>
  );
}
