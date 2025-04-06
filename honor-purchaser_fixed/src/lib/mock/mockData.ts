// モックユーザーデータ
export const mockUser = {
    uid: 'mock-user-id',
    email: 'user@example.com',
    displayName: 'テストユーザー',
    photoURL: null
  };
  
  // モックユーザー情報
  export const mockUserData = {
    uid: 'mock-user-id',
    displayName: 'テストユーザー',
    photoURL: null,
    totalPaid: 1500,
    balance: 3000,
    createdAt: new Date()
  };
  
  // モックランキングデータ
  export const mockRankings = [
    { id: 'user1', rank: 1, displayName: 'ユーザーA', totalPaid: 5000 },
    { id: 'user2', rank: 2, displayName: 'ユーザーB', totalPaid: 3200 },
    { id: 'user3', rank: 3, displayName: 'ユーザーC', totalPaid: 2800 },
    { id: 'mock-user-id', rank: 4, displayName: 'テストユーザー', totalPaid: 1500 },
    { id: 'user5', rank: 5, displayName: 'ユーザーE', totalPaid: 1200 },
    { id: 'user6', rank: 6, displayName: 'ユーザーF', totalPaid: 800 },
    { id: 'user7', rank: 7, displayName: 'ユーザーG', totalPaid: 750 },
    { id: 'user8', rank: 8, displayName: 'ユーザーH', totalPaid: 600 },
    { id: 'user9', rank: 9, displayName: 'ユーザーI', totalPaid: 450 },
    { id: 'user10', rank: 10, displayName: 'ユーザーJ', totalPaid: 300 },
  ];
  
// モックブーストタイム設定
export const mockBoostStatus = {
    isBoostActive: false,
    // 固定値にする（サーバーとクライアントで同じ値を使用）
    nextBoostTime: new Date(Date.now() + 30 * 60 * 1000) // 30分後
  };
  
  // モック支払い履歴
  export const mockPayments = [
    { 
      id: 'payment1',
      userId: 'mock-user-id',
      amount: 500,
      type: 'charge',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed'
    },
    { 
      id: 'payment2',
      userId: 'mock-user-id',
      amount: 1,
      type: 'payment',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    { 
      id: 'payment3',
      userId: 'mock-user-id',
      amount: 10,
      type: 'payment',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
  ];