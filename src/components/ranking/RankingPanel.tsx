'use client';

import { useState, useEffect } from 'react';
import { FiAward, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { RankingItem, RankingType } from '@/types';

interface RankingPanelProps {
  rankings: RankingItem[];
  currentUserId?: string | null;
  showRanking: boolean;
  onToggleRanking: () => void;
}

const RankingPanel: React.FC<RankingPanelProps> = ({
  rankings,
  currentUserId,
  showRanking,
  onToggleRanking,
}) => {
  const [activeTab, setActiveTab] = useState<RankingType>('total');
  const [animateRank, setAnimateRank] = useState<number | null>(null);
  
  // ランキング内のユーザー位置を強調表示する
  useEffect(() => {
    if (currentUserId) {
      const userRank = rankings.findIndex(user => user.id === currentUserId);
      if (userRank >= 0) {
        setAnimateRank(userRank);
        const timer = setTimeout(() => setAnimateRank(null), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [rankings, currentUserId]);

  return (
    <div 
      className={`absolute top-0 right-0 lg:right-4 bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-b-lg p-4 w-64 lg:w-72 shadow-xl border border-gray-700 transition-all duration-300 ${
        showRanking ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ランキング
        </h2>
        <button 
          onClick={onToggleRanking}
          className="text-gray-400 hover:text-white"
        >
          {showRanking ? <FiArrowRight size={18} /> : <FiArrowLeft size={18} />}
        </button>
      </div>
      
      {/* タブ切り替え */}
      <div className="flex text-xs mb-3 border-b border-gray-700">
        <button 
          onClick={() => setActiveTab('total')}
          className={`flex-1 py-2 ${activeTab === 'total' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        >
          総合
        </button>
        <button 
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-2 ${activeTab === 'daily' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        >
          日間
        </button>
        <button 
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-2 ${activeTab === 'weekly' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        >
          週間
        </button>
        <button 
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 py-2 ${activeTab === 'monthly' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        >
          月間
        </button>
      </div>
      
      {/* ランキングリスト */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {rankings.length > 0 ? (
          rankings.map((user, index) => (
            <div 
              key={user.id}
              className={`flex justify-between items-center p-2 rounded 
                ${user.id === currentUserId ? 'bg-blue-900 bg-opacity-40 border border-blue-500' : 'bg-gray-700 bg-opacity-40'}
                ${animateRank === index ? 'animate-pulse' : ''}
              `}
            >
              <span className={`font-bold w-6 text-center ${
                index === 0 ? 'text-yellow-400' : 
                index === 1 ? 'text-gray-300' : 
                index === 2 ? 'text-amber-600' : 
                'text-gray-400'
              }`}>
                {index + 1}.
              </span>
              
              <span className={`flex-grow px-2 truncate ${user.id === currentUserId ? 'font-bold' : ''}`}>
                {user.displayName}
                {index < 3 && <FiAward className="inline ml-1" />}
              </span>
              
              <span className="font-mono">{user.totalPaid}円</span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">
            ランキングデータがありません
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-center text-gray-400">
        上位10%のユーザーには「名誉」が与えられます
      </div>
    </div>
  );
};

export default RankingPanel;