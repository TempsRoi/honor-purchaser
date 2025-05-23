import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'false';

// カスタム型定義（モック用）
type MockAuth = {
  verifyIdToken: () => Promise<{ uid: string }>;
};

type MockFirestore = {
  collection: () => {
    doc: () => {
      get: () => Promise<{ exists: boolean; data: () => Record<string, unknown> }>;
      set: () => Promise<void>;
      update: () => Promise<void>;
    };
  };
};

// モックオブジェクトの定義
const mockAuth: MockAuth = {
  verifyIdToken: async () => ({ uid: 'mock-user-id' }),
};

const mockFirestore: MockFirestore = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        exists: true,
        data: () => ({}),
      }),
      set: async () => {},
      update: async () => {},
    }),
  }),
};

// 型ガード
function isMockAuth(auth: unknown): auth is MockAuth {
  return typeof (auth as MockAuth).verifyIdToken === 'function';
}

// 🔧 この関数を追加（ここが新しい）
function isMockFirestore(db: any): db is MockFirestore {
  return (
    typeof db?.collection === 'function' &&
    typeof db.collection('x')?.doc === 'function' &&
    typeof db.collection('x')?.where !== 'function' // 本物の Firestore にはある
  );
}

// Firebase Admin の初期化関数
function initializeFirebaseAdmin(): { auth: Auth | MockAuth; firestore: Firestore | MockFirestore } {
  if (isMockMode) {
    return {
      auth: mockAuth,
      firestore: mockFirestore,
    };
  }

  let serviceAccount: any = null;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const decodedKey = Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        'base64'
      ).toString('utf-8');
      serviceAccount = JSON.parse(decodedKey);
    }
  } catch (error) {
    console.error('Error parsing Firebase service account:', error);
  }

  // 安全な初期化条件（nullチェックも追加）
  if (serviceAccount && !getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  return {
    auth: getAuth(),
    firestore: getFirestore(),
  };
}

// Admin SDK のインスタンス化
const { auth, firestore } = initializeFirebaseAdmin();

// デバッグログ（任意）
if (isMockAuth(auth)) {
  console.log("✅ Using Mock Firebase Auth");
}
if (isMockFirestore(firestore)) {
  console.log("✅ Using Mock Firestore");
}

// 🔁 ここで型ガードも export して他で使えるように
export { auth, firestore, isMockFirestore, isMockAuth };
