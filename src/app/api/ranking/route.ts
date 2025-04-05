import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { firestore } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const limitValue = 10;  // ランキングの最大取得数

    try {
      // Firestoreインスタンスを取得
      const db = getFirestore();
      const rankingRef = db.collection('rankings')
        .where('type', '==', 'daily')
        .orderBy('amount', 'desc')
        .limit(limitValue);

      const rankingSnapshot = await rankingRef.get();

      if (rankingSnapshot.empty) {
        return NextResponse.json({ rankings: [] });
      }

      const rankings = rankingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`Fetched ${rankings.length} rankings`);

      return NextResponse.json({ rankings });
    } catch (error) {
      console.error('Firestore query error:', error);
      return NextResponse.json({ error: 'Firestore query failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
