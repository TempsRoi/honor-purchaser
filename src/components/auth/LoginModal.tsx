'use client';

import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiTwitter } from 'react-icons/fi';
import { useAuth } from '@/contexts/auth-context';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('ログインしました');
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ログイン"
    >
      <div className="space-y-6">
        <p className="text-gray-300">
          Honor Purchaserへようこそ！ログインして、ランキングに参加しましょう。
        </p>
        
        <div className="space-y-4">
          <Button
            fullWidth
            className="bg-white text-gray-800"
            onClick={handleGoogleLogin}
            isLoading={loading}
            icon={<FcGoogle size={20} />}
          >
            Googleでログイン
          </Button>
          
          <Button
            fullWidth
            className="bg-blue-500 text-white opacity-50 cursor-not-allowed"
            disabled
            icon={<FiTwitter size={20} />}
          >
            Twitter/Xでログイン（準備中）
          </Button>
        </div>
        
        <p className="mt-6 text-xs text-center text-gray-400">
          ログインすることで、<a href="#" className="text-blue-400 hover:underline">利用規約</a>および
          <a href="#" className="text-blue-400 hover:underline">プライバシーポリシー</a>に同意したものとみなされます。
        </p>
      </div>
    </Modal>
  );
};

export default LoginModal;