'use client';

import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { mockBoostStatus } from '@/lib/mock/mockData';
import { BoostTime } from '@/types';
import { useMockData } from '@/lib/utils';

interface BoostStore {
  isBoostActive: boolean;
  boostCountdown: number | null;
  nextBoostTime: Date | null;
  fetchBoostStatus: () => Promise<void>;
  startCountdown: () => () => void;
}

const useBoostStore = create<BoostStore>((set, get) => ({
  isBoostActive: false,
  boostCountdown: null,
  nextBoostTime: mockBoostStatus.nextBoostTime,
  
  // 現在のブーストステータスを取得
  fetchBoostStatus: async (): Promise<void> => {
    try {
      if (useMockData()) {
        // モックデータを使用
        await new Promise(resolve => setTimeout(resolve, 300)); // 遅延を模倣
        set({ 
          isBoostActive: mockBoostStatus.isBoostActive, 
          nextBoostTime: mockBoostStatus.nextBoostTime 
        });
        
        // 10%の確率でブーストタイムをアクティブにする（デモ用）
        if (Math.random() < 0.1) {
          set({ 
            isBoostActive: true, 
            boostCountdown: 60,
            nextBoostTime: null
          });
          get().startCountdown();
        }
      } else {
        // 実際のFirestoreからデータを取得
        const boostRef = doc(firestore, 'settings', 'boostTimes');
        const boostSnap = await getDoc(boostRef);
        
        if (boostSnap.exists()) {
          const data = boostSnap.data();
          const now = new Date();
          
          // 現在アクティブなブーストを確認
          if (data.currentBoost && data.currentBoost.endTime.toDate() > now) {
            const remainingSeconds = Math.floor((data.currentBoost.endTime.toDate().getTime() - now.getTime()) / 1000);
            set({ 
              isBoostActive: true, 
              boostCountdown: remainingSeconds,
              nextBoostTime: null
            });
            
            // カウントダウンを開始
            get().startCountdown();
          } else if (data.nextBoost) {
            // 次回のブースト時間
            set({
              isBoostActive: false,
              boostCountdown: null,
              nextBoostTime: data.nextBoost.toDate()
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching boost status:', error);
    }
  },
  
  // カウントダウン開始
  startCountdown: (): (() => void) => {
    const { boostCountdown } = get();
    if (!boostCountdown) return () => {};
    
    const interval = setInterval(() => {
      const { boostCountdown, isBoostActive } = get();
      
      if (!boostCountdown || boostCountdown <= 1 || !isBoostActive) {
        clearInterval(interval);
        set({ isBoostActive: false, boostCountdown: null });
        // 次のブースト時間を設定（デモ用）
        if (useMockData()) {
          const nextTime = new Date();
          nextTime.setMinutes(nextTime.getMinutes() + 30); // 30分後
          set({ nextBoostTime: nextTime });
        } else {
          // ブースト終了後、新しいステータスを取得
          get().fetchBoostStatus();
        }
      } else {
        set({ boostCountdown: boostCountdown - 1 });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }
}));

export default useBoostStore;