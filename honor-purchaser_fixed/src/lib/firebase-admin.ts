import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// カスタム型定義
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

// モックモードの場合のダミーオブジェクトを作成
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

// 型ガード関数
function isMockAuth(auth: unknown): auth is MockAuth {
  return typeof (auth as MockAuth).verifyIdToken === 'function';
}

function isMockFirestore(firestore: unknown): firestore is MockFirestore {
  return typeof (firestore as MockFirestore).collection === 'function';
}

// Firebase Adminの初期化関数
function initializeFirebaseAdmin(): { auth: Auth | MockAuth; firestore: Firestore | MockFirestore } {
  if (isMockMode) {
    return {
      auth: mockAuth,
      firestore: mockFirestore,
    };
  }

  let serviceAccount: any;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const decodedKey = Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        'base64'
      ).toString();
      serviceAccount = JSON.parse(decodedKey);
    }
  } catch (error) {
    console.error('Error parsing Firebase service account:', error);
  }

  if (!getApps().length) {
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

// Firebase Adminのインスタンスを作成
const { auth, firestore } = initializeFirebaseAdmin();

// 型チェックしてから利用
if (isMockAuth(auth)) {
  console.log("Mock Auth is being used");
}

if (isMockFirestore(firestore)) {
  console.log("Mock Firestore is being used");
}

export { auth, firestore };
