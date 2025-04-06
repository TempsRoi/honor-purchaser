import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase-admin';
import { useMockData } from '@/lib/utils';

interface RequestBody {
  userId: string;
  amount: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { userId, amount } = body;
    
    // 金額のバリデーション（1円または10円のみ許可）
    if (amount !== 1 && amount !== 10) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // モックモードでは常に成功
    if (useMockData()) {
      return NextResponse.json({ 
        success: true, 
        balance: 3000 - amount, 
        totalPaid: 1500 + amount 
      });
    }
    
    // ユーザーデータの取得
function isRealFirestore(db: any): db is Firestore {
  return typeof db.collection === 'function';
}

let userRef;
if (isRealFirestore(firestore)) {
  userRef = doc(firestore, 'users', userId);
} else {
  userRef = firestore.collection('users').doc(userId);
}
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userData = userDoc.data();
    
    // 残高チェック
    if (userData.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }
    
    // トランザクション処理
    await updateDoc(userRef, {
      balance: increment(-amount),
      totalPaid: increment(amount),
      lastPayment: serverTimestamp(),
    });
    
    // 支払い履歴を保存
    const paymentId = `pay_${userId}_${Date.now()}`;
    const paymentRef = doc(firestore, 'payments', paymentId);
    await setDoc(paymentRef, {
      userId,
      amount,
      type: 'payment',
      timestamp: serverTimestamp(),
    });
    
    return NextResponse.json({ 
      success: true,
      balance: userData.balance - amount,
      totalPaid: (userData.totalPaid || 0) + amount
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}