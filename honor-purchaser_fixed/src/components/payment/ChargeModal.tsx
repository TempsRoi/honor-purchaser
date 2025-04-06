'use client';

import React, { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import { useAuth } from '@/contexts/auth-context';
import useUserStore from '@/stores/userStore';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { getStripe } from '@/lib/stripe';
import { toast } from 'react-hot-toast';
import { useMockData } from '@/lib/utils';

interface ChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// チャージ金額オプション
const CHARGE_AMOUNTS = [
  { amount: 100, label: '100円' },
  { amount: 500, label: '500円' },
  { amount: 1000, label: '1,000円' },
  { amount: 3000, label: '3,000円' },
  { amount: 5000, label: '5,000円' },
  { amount: 10000, label: '10,000円' },
];

const ChargeModal: React.FC<ChargeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { chargeBalance } = useUserStore();
  const [selectedAmount, setSelectedAmount] = useState<number>(CHARGE_AMOUNTS[1].amount);
  const [loading, setLoading] = useState<boolean>(false);
  const isMockMode = useMockData();

  const handleStripeCheckout = async () => {
    if (!user) {
      toast.error('ログインが必要です');
      return;
    }

    setLoading(true);
    try {
      if (isMockMode) {
        await chargeBalance(user.uid, selectedAmount);
        toast.success(`${selectedAmount}円をチャージしました！（モックモード）`);
        onClose();
      } else {
        // ユーザーオブジェクトが正しいかチェック
        if (typeof user.getIdToken === 'function') {
          const token = await user.getIdToken();
          const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              amount: selectedAmount,
              userId: user.uid,
            }),
          });

          if (!response.ok) {
            throw new Error('Checkout session creation failed');
          }

          const { sessionId } = await response.json();
          const stripe = await getStripe();
          if (!stripe) {
            throw new Error('Failed to load Stripe');
          }

          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            throw error;
          }
        } else {
          throw new Error('User object does not have getIdToken method');
        }
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      toast.error('決済処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // デモ用の即時チャージ機能
  const handleDemoCharge = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const success = await chargeBalance(user.uid, selectedAmount);
      if (success) {
        toast.success(`${selectedAmount}円をチャージしました！`);
        onClose();
      } else {
        toast.error('チャージに失敗しました');
      }
    } catch (error) {
      console.error('Charge error:', error);
      toast.error('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="チャージ">
      <div className="space-y-6">
        <p className="text-gray-300">
          チャージ金額を選択してください。{isMockMode ? '（モックモード）' : 'Stripeで安全に決済処理を行います。'}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {CHARGE_AMOUNTS.map((item) => (
            <button
              key={item.amount}
              onClick={() => setSelectedAmount(item.amount)}
              className={`p-3 rounded-lg ${
                selectedAmount === item.amount 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="text-center mb-2 text-gray-300">選択金額</div>
          <div className="text-3xl font-bold text-center">{selectedAmount}円</div>
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            fullWidth
            variant="primary"
            onClick={isMockMode ? handleDemoCharge : handleStripeCheckout}
            isLoading={loading}
            icon={<FiCreditCard size={20} />}
          >
            {isMockMode ? 'チャージする（モックモード）' : 'Stripeで決済する'}
          </Button>
        </div>

        <p className="mt-6 text-xs text-center text-gray-400">
          {isMockMode 
            ? 'モックモードでは実際の決済は行われません。' 
            : '決済情報は安全に処理されます。処理完了後、自動的に残高に反映されます。'}
        </p>
      </div>
    </Modal>
  );
};

export default ChargeModal;
