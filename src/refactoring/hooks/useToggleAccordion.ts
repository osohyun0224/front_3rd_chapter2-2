import { useCallback, useState } from 'react';
import { updateSet } from "./utils";

/**
 * @function useToggleAccordion
 * @description 선택자 컴포넌트에서 아이템의 확장 상태
 * @returns {{ openItems: any; toggleProducts: any; }}
 */

export const useToggleAccordion = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleProducts = useCallback((id: string) => {
    setOpenItems((prev) => updateSet(prev, id));
  }, []);

  return { openItems, toggleProducts };
}
