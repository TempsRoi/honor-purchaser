import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 bg-opacity-70 backdrop-blur-sm text-white p-4 text-center">
      <p className="mb-2 text-sm text-gray-400">© 2024 Honor Purchaser. All rights reserved.</p>
      <div className="flex justify-center space-x-4 text-sm">
        <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
          利用規約
        </Link>
        <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
          プライバシーポリシー
        </Link>
      </div>
    </footer>
  );
};

export default Footer;