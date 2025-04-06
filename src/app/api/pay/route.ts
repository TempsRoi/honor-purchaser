import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, increment, Firestore } from 'firebase/firestore';
import { firestore } from '@/lib/firebase-admin';

// 型ガード関数をブロック外に定義
function isRealFirestore(db: any): db is Firestore {
  return typeof db.collection === 'function';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount } = body;

    if (amount !== 1 && amount !== 10) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    let userRef;
    if (isRealFirestore(firestore)) {
      userRef = doc(firestore, 'users', userId);
    } else {
      // MockFirestore対応
      userRef = firestore.collection('users').doc(userId);
    }

    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await updateDoc(userRef, {
      balance: increment(-amount),
      totalPaid: increment(amount),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
  }
}
