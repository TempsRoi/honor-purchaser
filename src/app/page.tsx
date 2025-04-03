'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import useUserStore from '@/stores/userStore';
import useRankingStore from '@/stores/rankingStore';
import useBoostStore from '@/stores/boostStore';
import { FiClock } from 'react-icons/fi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RankingPanel from '@/components/ranking/RankingPanel';
import LoginModal from '@/components/auth/LoginModal';
import ChargeModal from '@/components/payment/ChargeModal';
import PayButton from '@/components/payment/PayButton';
import Card from '@/components/ui/Card';
import { useMockData } from '@/lib/utils';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { userData, fetchUserData } = useUserStore();
  const { rankings, fetchRankings } = useRankingStore();
  const { isBoostActive, boostCountdown, nextBoostTime, fetchBoostStatus } = useBoostStore();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showRanking, setShowRanking] = useState(true);
  const [nextBoostMinutes, setNextBoostMinutes] = useState<number | null>(null);
  const isMockMode = useMockData();
  
  // 初期データの読み込み
  useEffect(() => {
    if (user && !authLoading) {
      fetchUserData(user.uid);
    }
    fetchRankings();
    fetchBoostStatus();
    
    // 定期的にランキングとブースト状態を更新
    const rankingInterval = setInterval(fetchRankings, 60000);
    const boostInterval = setInterval(fetchBoostStatus, 30000);
    
    return () => {
      clearInterval(rankingInterval);
      clearInterval(boostInterval);
    };
  }, [user, authLoading]);
  
  // 次回ブースト時間の計算（クライアントサイドのみ）
  useEffect(() => {
    if (nextBoostTime) {
      const calculateMinutes = () => {
        const minutes = Math.ceil((nextBoostTime.getTime() - new Date().getTime()) / 60000);
        setNextBoostMinutes(minutes);
      };
      
      calculateMinutes();
      // 1秒ごとに更新
      const interval = setInterval(calculateMinutes, 1000);
      return () => clearInterval(interval);
    }
  }, [nextBoostTime]);
  
  // 現在のランキング位置を取得
  const getCurrentRank = () => {
    if (!user || !rankings.length) return null;
    
    const userRanking = rankings.find(rank => rank.id === user.uid);
    return userRanking ? userRanking.rank : null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        onToggleRanking={() => setShowRanking(!showRanking)}
        showRanking={showRanking}
      />

      <main className="flex flex-col items-center justify-center flex-grow px-4 relative">
        {isMockMode && (
          <div className="fixed top-0 left-0 bg-yellow-600 text-white px-2 py-1 text-xs z-50">
            モックモード
          </div>
        )}
        
        {/* ブーストタイム通知 */}
        {isBoostActive && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black font-bold py-2 px-4 rounded-full shadow-lg animate-pulse flex items-center">
            <FiClock className="mr-2" /> ブーストタイム！ {boostCountdown}秒 (10円支払い)
          </div>
        )}
        
        {/* クライアントサイドでのみレンダリングする */}
        {!isBoostActive && nextBoostMinutes !== null && (
          <div className="absolute top-4 left-4 text-xs text-gray-400">
            次回ブースト予定: 約{nextBoostMinutes}分後
          </div>
        )}
        
        {/* ランキングパネル */}
        <RankingPanel 
          rankings={rankings} 
          currentUserId={user?.uid}
          showRanking={showRanking}
          onToggleRanking={() => setShowRanking(!showRanking)}
        />
        
        <div className="flex flex-col items-center justify-center mt-8 z-10">
          {/* 支払い済み総額表示 */}
          <div className="mb-4 text-sm text-center">
            <span className="text-gray-400">あなたの支払い総額</span>
            <div className="text-2xl font-bold">
              {userData ? `${userData.totalPaid || 0}円` : '0円'}
            </div>
            
            {getCurrentRank() && (
              <div className="mt-1 text-sm text-blue-400">
                現在の順位: {getCurrentRank()}位
              </div>
            )}
          </div>
          
          {/* 支払いボタン */}
          <PayButton
            userId={user?.uid || null}
            onLoginRequired={() => setShowLoginModal(true)}
            onChargeRequired={() => setShowChargeModal(true)}
            onPaymentSuccess={() => fetchRankings()}
          />
          
          {/* 残高とチャージボタン */}
          <Card className="w-full max-w-xs mb-6">
            <div>
              <p className="text-sm text-gray-300 mb-1">現在の残高</p>
              <p className="text-3xl text-center font-bold mb-3">
                {userData ? `${userData.balance || 0}円` : '0円'}
              </p>
              <button 
                onClick={() => user ? setShowChargeModal(true) : setShowLoginModal(true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all"
              >
                チャージ
              </button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />

      {/* モーダル */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      
      <ChargeModal
        isOpen={showChargeModal}
        onClose={() => setShowChargeModal(false)}
      />
    </div>
  );
}