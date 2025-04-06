import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit, getDocs, Firestore, DocumentData, Query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase-admin';

// 型ガード関数をブロック外に定義
function isRealFirestore(db: any): db is Firestore {
  return typeof db.collection === 'function';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitValue = parseInt(searchParams.get('limit') || '10');

    let rankingQuery: Query<DocumentData>;

    if (isRealFirestore(firestore)) {
      rankingQuery = query(
        collection(firestore, 'rankings'),
        where('type', '==', 'daily'),
        orderBy('amount', 'desc'),
        limit(limitValue)
      );
    } else {
      // MockFirestore対応: コレクションとして扱う
      const rankingsCollection = firestore.collection('rankings');
      rankingQuery = query(
        rankingsCollection as unknown as Query<DocumentData>,
        where('type', '==', 'daily'),
        orderBy('amount', 'desc'),
        limit(limitValue)
      );
    }

    const rankingSnapshot = await getDocs(rankingQuery);
    const rankings = rankingSnapshot.docs.map(doc => doc.data());

    return NextResponse.json({ rankings });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
  }
}
