import React, { ReactNode, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { classNames } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className,
  closeOnOverlayClick = true,
}) => {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // スクロール防止
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // スクロール復活
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className={classNames(
          'bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full transform animate-fadeIn',
          sizeClasses[size],
          className || ''
        )}
      >
        {title && (
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h3 className="text-2xl font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        )}

        <div className="p-6">{children}</div>

        {footer && (
          <div className="flex justify-end p-6 border-t border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;