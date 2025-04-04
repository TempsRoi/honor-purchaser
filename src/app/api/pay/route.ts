import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { firestore } from '@/lib/firebase-admin';
import { useMockData } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    try {
      // Firestoreインスタンスを取得
      const db = getFirestore();
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // 残高の更新
      await userRef.update({
        balance: FieldValue.increment(amount),
        lastUpdated: FieldValue.serverTimestamp(),
      });

      console.log(`Updated balance for user: ${userId} with amount: ${amount}`);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Firestore update error:', error);
      return NextResponse.json({ error: 'Firestore update failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating user balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
