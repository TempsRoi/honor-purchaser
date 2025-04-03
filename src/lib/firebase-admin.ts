// サーバーサイドでのみインポートされるため、モックチェックは異なる方法で行う
const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// モックモードの場合はダミーオブジェクト
if (isMockMode) {
  const mock = {
    auth: {
      verifyIdToken: async () => ({ uid: 'mock-user-id' }),
    },
    firestore: {
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
    },
  };
  
  export const auth = mock.auth;
  export const firestore = mock.firestore;
} else {
  // 実際のFirebase Adminをインポート
  import { initializeApp, cert, getApps } from 'firebase-admin/app';
  import { getAuth } from 'firebase-admin/auth';
  import { getFirestore } from 'firebase-admin/firestore';

  // サービスアカウントの環境変数を取得
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

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  export const auth = getAuth();
  export const firestore = getFirestore();
}