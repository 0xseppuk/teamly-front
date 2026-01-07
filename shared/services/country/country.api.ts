import { axiosInstanse } from '../axios';

import { Country } from '@/shared/types';

export async function getCountries() {
  const response = await axiosInstanse.get<{
    countries: Country[];
    count: number;
  }>('/countries');

  return response.data;
}

export async function getCountriesByRegion(region: string) {
  const response = await axiosInstanse.get<{
    countries: Country[];
    count: number;
    region: string;
  }>(`/countries/region/${region}`);

  return response.data;
}
