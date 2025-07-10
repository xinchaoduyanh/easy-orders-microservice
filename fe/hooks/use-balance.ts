import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { fetchWithAuth } from "@/lib/api";

async function fetchBalance(email?: string) {
  if (!email) throw new Error("No email");
  const res = await fetchWithAuth(`/api/payments/balance?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Failed to fetch balance");
  const data = await res.json();
  return data?.data?.balance ?? null;
}

export function usePaymentBalance() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["payment-balance", user?.email],
    queryFn: () => fetchBalance(user?.email),
    enabled: !!user?.email,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000, // 1 phút
  });
}
