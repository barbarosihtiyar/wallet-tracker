import { useLocation, useNavigate } from 'react-router-dom';

const useNavigateWithQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithQuery = (
    path: string,
    queryParamName?: string,
    queryParamValue?: string,
  ): void => {
    const searchParams = location.search;
    navigate(`${path}${searchParams}`);

    if (queryParamName && queryParamValue) {
      localStorage.setItem(queryParamName, queryParamValue);
    }
  };

  return navigateWithQuery;
};

export default useNavigateWithQuery;
