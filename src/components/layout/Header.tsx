'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { FiUser, FiShare2, FiMenu, FiX } from 'react-icons/fi';
import Button from '@/components/ui/Button';

interface HeaderProps {
  onLoginClick: () => void;
  onToggleRanking: () => void;
  showRanking: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  onToggleRanking,
  showRanking,
}) => {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  
  // SNSシェア
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Honor Purchaser',
        text: '「1円支払う」ボタンを押して、ランキングに参加しよう！',
        url: window.location.href,
      });
    } else {
      // シェア機能がない場合はURLをコピー
      navigator.clipboard.writeText(window.location.href);
      alert('URLをコピーしました');
    }
  };
  
  return (
    <header className="py-4 px-6 flex justify-between items-center bg-gray-900 bg-opacity-70 backdrop-blur-sm z-20">
      <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Honor Purchaser
      </Link>
      
      {/* モバイルメニューボタン */}
      <button 
        className="md:hidden text-white"
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {/* デスクトップナビゲーション */}
      <nav className="hidden md:flex items-center space-x-3">
        <Button 
          variant="secondary"
          size="sm"
          onClick={onToggleRanking}
        >
          {showRanking ? 'ランキングを隠す' : 'ランキングを表示'}
        </Button>
        
        <Button 
          variant="secondary"
          size="sm"
          onClick={handleShare}
          icon={<FiShare2 />}
        >
          共有
        </Button>
        
        {user ? (
          <div className="flex items-center space-x-2">
            <Link href="/profile" className="flex items-center">
              {user.photoURL ? (
                <Image 
                  src={user.photoURL} 
                  alt={user.displayName || 'ユーザー'} 
                  width={32} 
                  height={32} 
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
            </Link>
            <Button 
              variant="danger"
              size="sm"
              onClick={() => signOut()}
            >
              ログアウト
            </Button>
          </div>
        ) : (
          <Button 
            variant="primary"
            size="sm"
            onClick={onLoginClick}
            icon={<FiUser />}
          >
            ログイン
          </Button>
        )}
      </nav>
      
      {/* モバイルメニュー */}
      {showMenu && (
        <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center justify-center">
          <button 
            className="absolute top-4 right-6 text-white"
            onClick={() => setShowMenu(false)}
          >
            <FiX size={24} />
          </button>
          
          <div className="flex flex-col items-center space-y-6">
            {user ? (
              <>
                <div className="flex flex-col items-center">
                  {user.photoURL ? (
                    <Image 
                      src={user.photoURL} 
                      alt={user.displayName || 'ユーザー'} 
                      width={48} 
                      height={48} 
                      className="rounded-full mb-2"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-2">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-white">{user.displayName || 'ユーザー'}</span>
                </div>
                
                <Link 
                  href="/profile" 
                  className="w-full text-center py-3 px-6 rounded-lg bg-gray-800 hover:bg-gray-700"
                  onClick={() => setShowMenu(false)}
                >
                  プロフィール
                </Link>
                
                <button 
                  onClick={() => {
                    signOut();
                    setShowMenu(false);
                  }}
                  className="w-full py-3 px-6 rounded-lg bg-red-600 hover:bg-red-700"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  onLoginClick();
                  setShowMenu(false);
                }}
                className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                ログイン
              </button>
            )}
            
            <button 
              onClick={() => {
                onToggleRanking();
                setShowMenu(false);
              }}
              className="w-full py-3 px-6 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              {showRanking ? 'ランキングを隠す' : 'ランキングを表示'}
            </button>
            
            <button 
              onClick={() => {
                handleShare();
                setShowMenu(false);
              }}
              className="w-full py-3 px-6 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
            >
              <FiShare2 className="mr-2" /> 共有
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;