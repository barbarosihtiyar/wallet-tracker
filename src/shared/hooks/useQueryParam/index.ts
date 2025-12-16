import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParam = (key: string): string | null => {
  const { search } = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get(key);
  }, [search, key]);
};

export default useQueryParam;
