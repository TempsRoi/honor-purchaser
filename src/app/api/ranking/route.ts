import { NextRequest, NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase-admin';
import { mockRankings } from '@/lib/mock/mockData';
import { RankingType } from '@/types';
import { useMockData } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get('type') || 'total') as RankingType;
    const limitParam = parseInt(searchParams.get('limit') || '100');
    
    // 制限値のバリデーション
    const limitValue = Math.min(Math.max(limitParam, 10), 100);
    
    // モックモードでは固定データを返す
    if (useMockData()) {
      return NextResponse.json({ rankings: mockRankings.slice(0, limitValue) });
    }
    
    let rankingQuery;
    
    switch (type) {
      case 'daily':
        // 日間ランキング
        rankingQuery = query(
          collection(firestore, 'rankings'),
          where('type', '==', 'daily'),
          orderBy('amount', 'desc'),
          limit(limitValue)
        );
        break;
        
      case 'weekly':
        // 週間ランキング
        rankingQuery = query(
          collection(firestore, 'rankings'),
          where('type', '==', 'weekly'),
          orderBy('amount', 'desc'),
          limit(limitValue)
        );
        break;
        
      case 'monthly':
        // 月間ランキング
        rankingQuery = query(
          collection(firestore, 'rankings'),
          where('type', '==', 'monthly'),
          orderBy('amount', 'desc'),
          limit(limitValue)
        );
        break;
        
      case 'total':
      default:
        // 総合ランキング（デフォルト）
        rankingQuery = query(
          collection(firestore, 'users'),
          orderBy('totalPaid', 'desc'),
          limit(limitValue)
        );
        break;
    }
    
    const querySnapshot = await getDocs(rankingQuery);
    
    // ランキングデータを整形
    const rankings = querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      
      // センシティブ情報を除外
      const { email, balance, createdAt, lastLogin, ...publicData } = data;
      
      return {
        id: doc.id,
        rank: index + 1,
        ...publicData,
      };
    });
    
    return NextResponse.json({ rankings });
  } catch (error) {
    console.error('Ranking fetch error:', error);
    return NextResponse.json({ error: 'Internal server error', rankings: [] }, { status: 500 });
  }
}