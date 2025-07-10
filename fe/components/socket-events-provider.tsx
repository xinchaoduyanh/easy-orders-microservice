'use client';

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePaymentBalance } from "@/hooks/use-balance";
import { useSocket } from "@/lib/socket-context"; // hoặc import đúng context bạn đang dùng

export function SocketEventsProvider({ children }: { children: React.ReactNode }) {
  const socket = useSocket();
  const { user } = useAuth();
  const { refetch } = usePaymentBalance();

  useEffect(() => {
    if (!socket || !user) return;
    const handleOrderUpdated = (order: any) => {
      if (order.userEmail === user.email && ["CONFIRMED", "CANCELLED"].includes(order.status)) {
        refetch();
      }
    };
    socket.on("orderUpdated", handleOrderUpdated);
    return () => {
      socket.off("orderUpdated", handleOrderUpdated);
    };
  }, [socket, user, refetch]);

  return <>{children}</>;
} 