import React, { ReactNode } from 'react';
import { classNames } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  footer?: ReactNode;
  isHoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  footer,
  isHoverable = false,
}) => {
  return (
    <div
      className={classNames(
        'bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700',
        isHoverable ? 'hover:shadow-xl transition-all hover:border-gray-600' : '',
        className || ''
      )}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-700">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      
      <div className="p-4">{children}</div>
      
      {footer && (
        <div className="px-4 py-3 border-t border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;