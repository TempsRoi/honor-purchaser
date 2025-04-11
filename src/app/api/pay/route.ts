import { NextRequest, NextResponse } from 'next/server';
import { firestore, isMockFirestore } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { limit } = await req.json?.() || {};
    const limitValue = limit ? parseInt(limit) : 10;

    if (isMockFirestore(firestore)) {
      // モックランキングデータ
      const mockRankings = [
        { id: '1', name: 'Mock User A', amount: 100 },
        { id: '2', name: 'Mock User B', amount: 80 },
      ];

      return NextResponse.json({ rankings: mockRankings });
    }

    // 実際のFirestoreを使用
    const rankingRef = firestore
      .collection('rankings')
      .where('type', '==', 'daily')
      .orderBy('amount', 'desc')
      .limit(limitValue);

    const snapshot = await rankingRef.get();

    if (snapshot.empty) {
      return NextResponse.json({ rankings: [] });
    }

    const rankings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ rankings });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
