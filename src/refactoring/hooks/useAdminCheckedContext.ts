import { Context, useContext } from 'react';
import { AdminContext } from '../context';

export const useContextProvider = <T>(contextType: Context<T | undefined>, message: string) => {
  const context = useContext(contextType);
  if (!context) throw new Error(message);
  return context;
};

export const useAdminCheckedContext = () => {
  return useContextProvider(AdminContext, '다른 곳에서 사용하지 못합니다.');
};
