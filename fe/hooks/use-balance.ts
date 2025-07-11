import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { fetchWithAuth } from "@/lib/api";

async function fetchBalance() {
  const res = await fetchWithAuth(`/api/payments/balance`);
  if (!res.ok) throw new Error("Failed to fetch balance");
  const data = await res.json();
  return data?.data?.balance ?? null;
}

export function usePaymentBalance() {
  return useQuery({
    queryKey: ["payment-balance"],
    queryFn: fetchBalance,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000, // 1 phút
  });
}
