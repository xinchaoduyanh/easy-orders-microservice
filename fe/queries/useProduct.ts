import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../lib/api';

export const productQueryKey = ['products'];

const productQueryFn = async () => {
  return getProducts();
};

export function useProduct(options = {}) {
  return useQuery({
    queryKey: productQueryKey,
    queryFn: productQueryFn,
    ...options,
  });
} 