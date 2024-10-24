import { FC, ReactNode } from 'react';
interface CouponItemProps {
  content: ReactNode;
  testId: string;
  className?: string;
}
//UI만
export const CouponItem: FC<CouponItemProps> =({ content, testId, className }) => {
  return (
    <div data-testid={testId} className={`bg-gray-100 p-2 rounded ${className || ''}`}>
      {content}
    </div>
  );
};

