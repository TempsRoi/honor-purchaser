// User関連の型定義
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserData {
  uid: string;
  email?: string;
  displayName: string;
  photoURL?: string;
  totalPaid: number;
  balance: number;
  createdAt: Date | FirebaseTimestamp;
  lastLogin?: Date | FirebaseTimestamp;
  lastPayment?: Date | FirebaseTimestamp;
}

// ランキング関連の型定義
export interface RankingItem {
  id: string;
  rank: number;
  displayName: string;
  photoURL?: string;
  totalPaid: number;
}

export type RankingType = 'total' | 'daily' | 'weekly' | 'monthly';

// 支払い関連の型定義
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  type: 'payment' | 'charge';
  timestamp: Date | FirebaseTimestamp;
  status?: 'completed' | 'pending' | 'failed';
  paymentId?: string;
}

// ブースト関連の型定義
export interface BoostTime {
  startTime: Date | FirebaseTimestamp;
  endTime: Date | FirebaseTimestamp;
  multiplier: number;
}

// Firebase型定義
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

// APIレスポンス型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}