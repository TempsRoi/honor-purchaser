import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, increment, getDoc, serverTimestamp } from 'firebase-admin/firestore';
import { firestore } from '@/lib/firebase-admin';
import { useMockData } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // ユーザーデータの取得
    try {
      const userRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // 残高の更新
      await updateDoc(userRef, {
        balance: increment(amount),
        lastUpdated: serverTimestamp()
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
