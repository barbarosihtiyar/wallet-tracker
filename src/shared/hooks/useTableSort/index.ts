import { useState } from 'react';

export interface TableSortReturn {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
}

export const useTableSort = (
  initialSortBy: string = '',
  initialSortOrder: 'asc' | 'desc' = 'asc',
): TableSortReturn => {
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  const handleSort = (field: string) => {
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);

    if (sortBy === capitalizedField) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortBy('');
        setSortOrder('asc');
      }
    } else {
      setSortBy(capitalizedField);
      setSortOrder('asc');
    }
  };

  return {
    sortBy,
    sortOrder,
    handleSort,
    setSortBy,
    setSortOrder,
  };
};

export default useTableSort;
