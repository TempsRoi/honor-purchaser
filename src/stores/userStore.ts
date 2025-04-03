'use client';

import { create } from 'zustand';
import { doc, getDoc, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { mockUserData } from '@/lib/mock/mockData';
import { UserData } from '@/types';
import { useMockData } from '@/lib/utils';

interface UserStore {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUserData: (userId: string) => Promise<void>;
  chargeBalance: (userId: string, amount: number) => Promise<boolean>;
  payAmount: (userId: string, amount: number) => Promise<boolean>;
}

const useUserStore = create<UserStore>((set, get) => ({
  userData: null,
  loading: true,
  error: null,

  // ユーザーデータの読み込み
  fetchUserData: async (userId: string): Promise<void> => {
    if (!userId) {
      set({ userData: null, loading: false });
      return;
    }

    set({ loading: true, error: null });
    
    try {
      if (useMockData()) {
        // モックデータを使用
        await new Promise(resolve => setTimeout(resolve, 500)); // 遅延を模倣
        set({ userData: mockUserData as UserData, loading: false });
      } else {
        // 実際のFirestoreからデータを取得
        const userRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          set({ userData: userSnap.data() as UserData, loading: false });
        } else {
          set({ userData: null, loading: false, error: 'User not found' });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      set({ loading: false, error: (error as Error).message });
    }
  },

  // 残高のチャージ
  chargeBalance: async (userId: string, amount: number): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      if (useMockData()) {
        // モックデータを使用
        await new Promise(resolve => setTimeout(resolve, 500)); // 遅延を模倣
        const { userData } = get();
        if (userData) {
          set({
            userData: {
              ...userData,
              balance: (userData.balance || 0) + amount
            }
          });
        }
      } else {
        // 実際のFirestoreを更新
        const userRef = doc(firestore, 'users', userId);
        await updateDoc(userRef, {
          balance: increment(amount),
          lastUpdated: serverTimestamp()
        });
        
        // ストア内のデータを更新
        const { userData } = get();
        if (userData) {
          set({
            userData: {
              ...userData,
              balance: (userData.balance || 0) + amount
            }
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error charging balance:', error);
      return false;
    }
  },

  // 支払い（1円または10円）
  payAmount: async (userId: string, amount: number): Promise<boolean> => {
    if (!userId) return false;
    
    const { userData } = get();
    if (!userData || userData.balance < amount) {
      return false; // 残高不足
    }
    
    try {
      if (useMockData()) {
        // モックデータを使用
        await new Promise(resolve => setTimeout(resolve, 300)); // 遅延を模倣
        set({
          userData: {
            ...userData,
            balance: userData.balance - amount,
            totalPaid: (userData.totalPaid || 0) + amount
          }
        });
      } else {
        // 実際のFirestoreを更新
        const userRef = doc(firestore, 'users', userId);
        await updateDoc(userRef, {
          balance: increment(-amount),
          totalPaid: increment(amount),
          lastPayment: serverTimestamp()
        });
        
        // ストア内のデータを更新
        set({
          userData: {
            ...userData,
            balance: userData.balance - amount,
            totalPaid: (userData.totalPaid || 0) + amount
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      return false;
    }
  },
}));

export default useUserStore;