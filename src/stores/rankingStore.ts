'use client';

import { create } from 'zustand';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { mockRankings } from '@/lib/mock/mockData';
import { RankingItem, RankingType } from '@/types';
import { useMockData } from '@/lib/utils';

interface RankingStore {
  rankings: RankingItem[];
  loading: boolean;
  error: string | null;
  fetchRankings: (type?: RankingType, limitCount?: number) => Promise<void>;
}

const useRankingStore = create<RankingStore>((set) => ({
  rankings: [],
  loading: false,
  error: null,
  
  // ランキングの取得
  fetchRankings: async (type: RankingType = 'total', limitCount: number = 100): Promise<void> => {
    set({ loading: true, error: null });
    
    try {
      if (useMockData()) {
        // モックデータを使用
        await new Promise(resolve => setTimeout(resolve, 500)); // 遅延を模倣
        set({ rankings: mockRankings, loading: false });
      } else {
        // 実際のFirestoreからデータを取得
        let rankingQuery;
        
        switch (type) {
          case 'daily':
            // 日間ランキング
            rankingQuery = query(
              collection(firestore, 'rankings'),
              where('type', '==', 'daily'),
              orderBy('amount', 'desc'),
              limit(limitCount)
            );
            break;
            
          case 'weekly':
            // 週間ランキング
            rankingQuery = query(
              collection(firestore, 'rankings'),
              where('type', '==', 'weekly'),
              orderBy('amount', 'desc'),
              limit(limitCount)
            );
            break;
            
          case 'monthly':
            // 月間ランキング
            rankingQuery = query(
              collection(firestore, 'rankings'),
              where('type', '==', 'monthly'),
              orderBy('amount', 'desc'),
              limit(limitCount)
            );
            break;
            
          case 'total':
          default:
            // 総合ランキング（デフォルト）
            rankingQuery = query(
              collection(firestore, 'users'),
              orderBy('totalPaid', 'desc'),
              limit(limitCount)
            );
            break;
        }
        
        const querySnapshot = await getDocs(rankingQuery);
        
        // ランキングデータを整形
        const rankings: RankingItem[] = querySnapshot.docs.map((doc, index) => {
          const data = doc.data();
          
          return {
            id: doc.id,
            rank: index + 1,
            displayName: data.displayName || 'ユーザー',
            photoURL: data.photoURL,
            totalPaid: data.totalPaid || 0
          };
        });
        
        set({ rankings, loading: false });
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
      set({ loading: false, error: (error as Error).message });
    }
  }
}));

export default useRankingStore;