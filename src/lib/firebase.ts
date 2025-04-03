import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { useMockData } from './utils';

// 環境変数からの設定情報
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase初期化（モックモードでなければ）
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// モックモードのチェック
const isMockMode = useMockData();

if (!isMockMode && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
} else {
  // モックモードの場合はダミーオブジェクト
  app = {} as FirebaseApp;
  auth = {} as Auth;
  firestore = {} as Firestore;
}

export { app, auth, firestore };