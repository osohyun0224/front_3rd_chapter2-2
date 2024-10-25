import { useAdminCheckedContext } from '../../../hooks';
import { Button } from '../atoms';
import { TitleLabel } from '../atoms';

export const Header = () => {
  const { isAdmin, setIsAdmin } = useAdminCheckedContext();
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <TitleLabel level="h1" size="xxl" weight="bold">
          쇼핑몰 관리 시스템
        </TitleLabel>
        <Button
          color="navigate"
          size="medium"
          text={isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
          onClick={() => setIsAdmin(!isAdmin)}
        />
      </div>
    </nav>
  );
};
