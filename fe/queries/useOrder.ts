import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrderById, createOrder, cancelOrder } from '../lib/api';

export function useOrder(orderId?: string) {
  const queryClient = useQueryClient();

  // Query: Lấy danh sách đơn hàng
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    enabled: !orderId,
    // Ngăn refetch tự động
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    // Chỉ refetch khi stale time hết hạn (5 phút)
    staleTime: 5 * 60 * 1000,
    // Cache trong 10 phút
    cacheTime: 10 * 60 * 1000,
  });

  // Query: Lấy chi tiết đơn hàng
  const orderDetailQuery = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
    // Ngăn refetch tự động
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    // Chỉ refetch khi stale time hết hạn (5 phút)
    staleTime: 5 * 60 * 1000,
    // Cache trong 10 phút
    cacheTime: 10 * 60 * 1000,
  });

  // Mutation: Tạo đơn hàng
  const createOrderMutation = useMutation({
    mutationFn: ({ userEmail, orderItems }: { userEmail: string; orderItems: { productId: string; quantity: number }[] }) =>
      createOrder(userEmail, orderItems),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Mutation: Hủy đơn hàng
  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });

  return {
    // Query
    ordersQuery,
    orderDetailQuery,
    // Mutation
    createOrder: createOrderMutation.mutate,
    createOrderAsync: createOrderMutation.mutateAsync,
    createOrderStatus: createOrderMutation.status,
    cancelOrder: cancelOrderMutation.mutate,
    cancelOrderAsync: cancelOrderMutation.mutateAsync,
    cancelOrderStatus: cancelOrderMutation.status,
  };
} 