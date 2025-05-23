'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'react-hot-toast';

interface ChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const chargeOptions = [100, 500, 1000, 5000, 10000];

const ChargeModal: React.FC<ChargeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCharge = async () => {
    if (!user) {
      toast.error('ログインしてください');
      return;
    }
    if (!selectedAmount) {
      toast.error('金額を選択してください');
      return;
    }

    setLoading(true);
    try {
      if ('getIdToken' in user && typeof user.getIdToken === 'function') {
        const token = await user.getIdToken();
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: selectedAmount }),
        });

        if (response.ok) {
          const { url } = await response.json();
          window.location.href = url;
        } else {
          const { error } = await response.json();
          throw new Error(error);
        }
      } else {
        throw new Error('ユーザー情報が正しくありません');
      }
    } catch (error) {
      console.error('チャージエラー:', error);
      toast.error('チャージに失敗しました');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white text-black rounded-lg p-6 w-11/12 max-w-md shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">チャージ金額を選択</h2>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {chargeOptions.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`
                    w-28 h-28 rounded-full flex items-center justify-center
                    text-white font-semibold text-lg
                    transition-all duration-300
                    ${selectedAmount === amount
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-600 scale-110'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 hover:from-blue-600 hover:to-purple-700'}
                  `}
                >
                  {amount}円
                </button>
              ))}
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={handleCharge}
                disabled={loading || !selectedAmount}
                className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? '処理中...' : `${selectedAmount ?? ''}円をチャージ`}
              </button>
              <button
                onClick={onClose}
                className="text-gray-600 hover:underline text-sm"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChargeModal;
