"use client";

import { useState, useEffect } from "react";
import { processCharge } from "@/utils/stripe";
import { auth, db } from "@/utils/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ref, onValue } from "firebase/database";

export default function PayButton(): JSX.Element {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const authInstance = getAuth();
    authInstance.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const balanceRef = ref(db, `users/${currentUser.uid}/balance`);
        onValue(balanceRef, (snapshot) => setBalance(snapshot.val() || 0));
      }
    });
  }, []);

  const handlePayment = async (): Promise<void> => {
    if (balance < 1) {
      alert("残高が足りません。チャージしてください。");
      return;
    }
    await processPayment(user.uid, 1);
    alert("1円支払い完了！");
  };

  const handleLogin = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
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
