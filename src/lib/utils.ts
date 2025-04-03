/**
 * クラス名を条件付きで結合するユーティリティ関数
 */
export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 数値をフォーマットする関数（日本円表示用）
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * 日付をフォーマットする関数
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

/**
 * Firebase Timestamp を Date に変換
 */
export function timestampToDate(timestamp: any): Date | null {
  if (!timestamp) return null;
  
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  
  return null;
}

/**
 * ランキング順位に基づいたバッジカラーを取得
 */
export function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'text-yellow-400'; // 金
    case 2:
      return 'text-gray-300'; // 銀
    case 3:
      return 'text-amber-600'; // 銅
    default:
      return 'text-gray-400';
  }
}

/**
 * 環境変数に基づいてモック使用フラグを取得
 */
export function useMockData(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
}