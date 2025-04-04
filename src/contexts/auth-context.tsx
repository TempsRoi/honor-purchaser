'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { mockUser } from '@/lib/mock/mockData';
import { User } from '@/types';
import { useMockData } from '@/lib/utils';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Firestoreにユーザー情報を保存または更新
const saveUserToFirestore = async (user: User) => {
  try {
    const userRef = doc(firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // 既存ユーザーかどうかを判定
    if (userSnap.exists()) {
      console.log('既存ユーザーのデータを維持します');
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(), // 最終ログイン日時を更新
      }, { merge: true }); // 既存データを維持しつつ更新
    } else {
      console.log('新規ユーザーとして登録します');
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(), // 最終ログイン日時を更新
        balance: 10,  // 新規ユーザーのみ初期化
        totalPaid: 0, // 新規ユーザーのみ初期化
      });
    }
    console.log('ユーザー情報をFirestoreに保存しました');
  } catch (error) {
    console.error('Firestoreへのユーザー保存エラー:', error);
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isMockMode = useMockData();

  // Googleログイン
  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      setLoading(true);

      if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(mockUser);
        await saveUserToFirestore(mockUser); // モックユーザーも保存
        return mockUser;
      } else {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;

        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'No Name',
          photoURL: firebaseUser.photoURL || '',
        };
        setUser(user);

        // Firestoreに保存または更新
        await saveUserToFirestore(user);
        return user;
      }
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        await firebaseSignOut(auth);
      }
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'No Name',
          photoURL: firebaseUser.photoURL || '',
        };
        setUser(user);

        // Firestoreに保存または更新
        await saveUserToFirestore(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isMockMode]);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
