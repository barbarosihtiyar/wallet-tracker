/**
 * Normalizes text for Turkish locale comparison
 * Useful for case-insensitive searching/filtering
 */
export const normalizeText = (text: string): string => {
  return text.toLocaleLowerCase("tr");
};

/**
 * Filters an array of items by search term
 * Supports flexible label extraction via labelExtractor function
 */
export const filterBySearchTerm = <T>(
  items: T[],
  searchValue: string,
  labelExtractor: (item: T) => string,
): T[] => {
  if (!searchValue) return items;

  const searchTerm = normalizeText(searchValue);
  return items.filter((item) => {
    const label = normalizeText(labelExtractor(item));
    return label.includes(searchTerm);
  });
};
