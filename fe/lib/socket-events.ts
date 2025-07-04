'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useSocket } from './socket-context';
import type { Order } from './types';

export const useSocketEvents = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Debounce refs
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastInvalidateTime = useRef<number>(0);

  // Debounced invalidate function
  const debouncedInvalidate = useCallback((queryKey: string[]) => {
    const now = Date.now();
    const timeSinceLastInvalidate = now - lastInvalidateTime.current;
    
    // Nếu chưa đủ 2 giây từ lần invalidate cuối, thì debounce
    if (timeSinceLastInvalidate < 2000) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        console.log('SocketEvents: Debounced invalidate for', queryKey);
        queryClient.invalidateQueries({ queryKey });
        lastInvalidateTime.current = Date.now();
      }, 2000);
    } else {
      // Nếu đã đủ 2 giây, invalidate ngay lập tức
      console.log('SocketEvents: Immediate invalidate for', queryKey);
      queryClient.invalidateQueries({ queryKey });
      lastInvalidateTime.current = now;
    }
  }, [queryClient]);

  // Centralized socket event handlers
  const handleOrderUpdated = useCallback((updatedOrder: Order) => {
    console.log('SocketEvents: Received orderUpdated event for order:', updatedOrder.id);
    
    // Debounced invalidate
    debouncedInvalidate(['orders']);
    debouncedInvalidate(['order', updatedOrder.id]);
    
    // Show toast notification
    toast({
      title: 'Cập nhật đơn hàng',
      description: `Đơn hàng #${updatedOrder.id} đã được cập nhật`,
    });
  }, [debouncedInvalidate, toast]);

  const handleOrderCreated = useCallback((newOrder: Order) => {
    console.log('SocketEvents: Received orderCreated event for order:', newOrder.id);
    
    // Debounced invalidate
    debouncedInvalidate(['orders']);
    
    // Show toast notification
    toast({
      title: 'Đơn hàng mới',
      description: `Đơn hàng #${newOrder.id} đã được tạo`,
    });
  }, [debouncedInvalidate, toast]);

  // Setup socket event listeners
  useEffect(() => {
    if (!socket) return;

    console.log('SocketEvents: Setting up event listeners');
    
    socket.on('orderUpdated', handleOrderUpdated);
    socket.on('orderCreated', handleOrderCreated);

    return () => {
      console.log('SocketEvents: Cleaning up event listeners');
      socket.off('orderUpdated', handleOrderUpdated);
      socket.off('orderCreated', handleOrderCreated);
      
      // Clear debounce timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [socket, handleOrderUpdated, handleOrderCreated]);
}; 