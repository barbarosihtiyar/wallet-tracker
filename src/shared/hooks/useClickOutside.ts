import { RefObject, useEffect } from 'react';

/**
 * Hook to detect clicks outside of specified element(s)
 * @param refs - Single ref or array of refs to elements to detect outside clicks
 * @param handler - Callback to execute when click outside is detected
 * @param additionalSelectors - Optional CSS selectors for additional elements to exclude (e.g., dropdowns)
 */
export const useClickOutside = (
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: () => void,
  additionalSelectors?: string[],
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const refsArray = Array.isArray(refs) ? refs : [refs];

      const isInsideRefs = refsArray.some(
        ref => ref.current && ref.current.contains(target),
      );

      const isInsideAdditional = additionalSelectors?.some(selector =>
        target.closest(selector),
      );

      if (!isInsideRefs && !isInsideAdditional) {
        handler();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [refs, handler, additionalSelectors]);
};
