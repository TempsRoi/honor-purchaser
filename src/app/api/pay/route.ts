import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, increment, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase-admin';
import { useMockData } from '@/lib/utils';

// 型ガード関数: Firestoreかどうかを判定
function isFirestore(instance: any): instance is FirebaseFirestore.Firestore {
  return instance && typeof instance.collection === 'function';
}

export async function POST(req: NextRequest) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // ユーザーデータの取得（型ガードを適用）
    if (isFirestore(firestore)) {
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
    } else {
      console.error('Invalid Firestore instance');
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating user balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
