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

    const rankingInterval = setInterval(fetchRankings, 60000);
    const boostInterval = setInterval(fetchBoostStatus, 30000);

    return () => {
      clearInterval(rankingInterval);
      clearInterval(boostInterval);
    };
  }, [user, authLoading]);

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

        <RankingPanel
          rankings={rankings}
          currentUserId={user?.uid}
          showRanking={showRanking}
          onToggleRanking={() => setShowRanking(!showRanking)}
        />

        <div className="flex flex-col items-center justify-center mt-8 z-10">
          <PayButton
            userId={user?.uid || null}
            onLoginRequired={() => setShowLoginModal(true)}
            onChargeRequired={() => setShowChargeModal(true)}
            onPaymentSuccess={() => fetchRankings()}
          />

          {/* 🔽 残高表示とチャージボタンの追加 */}
          {user && userData && (
            <div className="mt-4 flex flex-col items-center space-y-2">
              <p className="text-lg">
                現在の残高：<span className="font-bold">{userData.balance}円</span>
              </p>
              <button
                onClick={() => setShowChargeModal(true)}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
              >
                チャージ
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

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
