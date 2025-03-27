import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Stripeの初期化（推奨バージョン）
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia", // 安定バージョンを使用
});

// リクエストの型定義
type ChargeRequestBody = {
  amount: number;
};

export async function POST(req: NextRequest) {
  const body: ChargeRequestBody = await req.json(); // 型を明示

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: { name: "チャージ" },
          unit_amount: body.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/charge",
  });

  return NextResponse.json({ url: session.url });
}
