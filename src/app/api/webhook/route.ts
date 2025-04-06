import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { doc, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase-admin';
import stripe from '@/lib/stripe-server';
import { useMockData } from '@/lib/utils';

export async function POST(req: NextRequest) {
  // モックモードの場合は常に成功
  if (useMockData()) {
    return NextResponse.json({ received: true });
  }

  try {
    const body = await req.text();
    const sig = headers().get('stripe-signature');
    
    let event;
    
    // イベントの検証
    try {
      if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('Webhook secret or signature missing');
      }
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
    
    // イベントタイプに基づいた処理
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // メタデータからユーザーIDと金額を取得
      const { userId, amount } = session.metadata || {};
      
      if (userId && amount) {
        try {
          // ユーザーの残高を更新
          const userRef = doc(firestore, 'users', userId);
          await updateDoc(userRef, {
            balance: increment(parseInt(amount)),
            lastCharged: serverTimestamp(),
          });
          
          // 決済履歴を保存
          const paymentRef = doc(firestore, 'payments', session.id);
          await setDoc(paymentRef, {
            userId,
            amount: parseInt(amount),
            status: 'completed',
            paymentId: session.payment_intent,
            timestamp: serverTimestamp(),
          });
          
          console.log(`Successful charge: ${userId} charged ${amount}JPY`);
        } catch (error) {
          console.error('Firestore update error:', error);
          return NextResponse.json({ error: 'Firestore update failed' }, { status: 500 });
        }
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// メタデータを指定
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
