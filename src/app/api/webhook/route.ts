import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { firestore } from '@/lib/firebase-admin';
import { useMockData } from '@/lib/utils';

export async function POST(req: NextRequest) {
  if (useMockData()) {
    return NextResponse.json({ received: true });
  }

  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;

    try {
      if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('Webhook secret or signature missing');
      }
      event = JSON.parse(body);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const { userId, amount } = session.metadata || {};

      if (userId && amount) {
        try {
          // Firestoreのユーザーデータ更新
          const db = getFirestore();
          const userRef = db.collection('users').doc(userId);

          await userRef.update({
            balance: FieldValue.increment(parseInt(amount)),
            lastCharged: FieldValue.serverTimestamp(),
          });

          // 決済履歴の保存
          const paymentRef = db.collection('payments').doc(session.id);
          await paymentRef.set({
            userId,
            amount: parseInt(amount),
            status: 'completed',
            paymentId: session.payment_intent,
            timestamp: FieldValue.serverTimestamp(),
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
