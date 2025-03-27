import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-02-24.acacia"
  });
  

export async function POST(req: NextRequest) {
  const { amount, customerId } = await req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // 円単位なので100倍
    currency: "jpy",
    customer: customerId, // 事前に作成したStripeカスタマーID
    payment_method_types: ["card"],
    setup_future_usage: "off_session", // 3Dセキュア対応
    confirm: true,
    return_url: "http://localhost:3000/success", // 成功時リダイレクト
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
