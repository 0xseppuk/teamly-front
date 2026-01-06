import { useQuery } from '@tanstack/react-query';
import { getCountries } from './country.api';

export const useGetCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  });
};
