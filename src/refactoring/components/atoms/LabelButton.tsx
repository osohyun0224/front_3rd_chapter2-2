import { FC } from 'react';

type LabelButtonProps = {
  onClick: () => void;
  label: string;
  testId: string;
}

export const LabelButton: FC<LabelButtonProps> = ({ onClick, label, testId }) => {
  return (
    <button data-testid={testId} onClick={onClick} className="w-full text-left font-semibold">
      {label}
    </button>
  );
};
