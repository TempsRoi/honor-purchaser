'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'react-hot-toast';


interface ChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChargeModal: React.FC<ChargeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCharge = async () => {
    if (!user) {
      toast.error('ログインしてください');
      return;
    }

    setLoading(true);
    try {
      // getIdToken() が存在するかを型で保証
      if ('getIdToken' in user && typeof user.getIdToken === 'function') {
        const token = await user.getIdToken();
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
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
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-xl font-bold mb-2">チャージ金額</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value, 10))}
              className="border p-2 w-full mb-2"
              placeholder="金額を入力"
            />
            <button
              onClick={handleCharge}
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'チャージ中...' : 'チャージ'}
            </button>
            <button onClick={onClose} className="mt-2 text-gray-500">
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChargeModal;
