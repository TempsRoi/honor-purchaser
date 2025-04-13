'use client';

import React, { useState } from 'react';
import { FiAward } from 'react-icons/fi';
import useUserStore from '@/stores/userStore';
import useBoostStore from '@/stores/boostStore';
import { toast } from 'react-hot-toast';

interface PayButtonProps {
  userId: string | null;
  onLoginRequired: () => void;
  onChargeRequired: () => void;
  onPaymentSuccess: () => void;
}

const PayButton: React.FC<PayButtonProps> = ({
  userId,
  onLoginRequired,
  onChargeRequired,
  onPaymentSuccess,
}) => {
  const { userData, payAmount } = useUserStore();
  const { isBoostActive } = useBoostStore();
  const [isLoading, setIsLoading] = useState(false);

  //チャージボタン確認用
  console.log("🔥 userData:", userData);

  const handlePayment = async () => {
    if (!userId) {
      onLoginRequired();
      return;
    }

    if (!userData) {
      toast.error('ユーザー情報が取得できません');
      onChargeRequired();
      return;
    }

    setIsLoading(true);

    try {
      const amount = isBoostActive ? 10 : 1;

      console.log(amount, userData.balance);

      if (userData.balance < amount) {
        toast.error('残高が不足しています');
        onChargeRequired();
        return;
      }

      const success = await payAmount(userId, amount);

      if (success) {
        toast.success(`${amount}円支払いました！`);
        onPaymentSuccess();
      } else {
        toast.error('支払い処理に失敗しました');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`
        relative overflow-hidden 
        ${isBoostActive
          ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}
        text-white font-bold py-6 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 mb-8 w-64 h-64 flex flex-col items-center justify-center
        ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
      `}
    >
      {isLoading ? (
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      ) : (
        <>
          <span className={`text-xl ${isBoostActive ? 'animate-pulse' : ''}`}>
            {isBoostActive ? '10円支払う' : '1円支払う'}
          </span>
          <FiAward className="text-4xl mt-2" />
        </>
      )}
    </button>
  );
};

export default PayButton;
