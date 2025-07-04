'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Order } from './types';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // Setup socket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
    
    newSocket.on('connect', () => {
      console.log('Socket: Connected to server');
    });
    
    newSocket.on('disconnect', () => {
      console.log('Socket: Disconnected from server');
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket: Connection error:', error);
    });
    
    setSocket(newSocket);
    
    return () => {
      console.log('Socket: Cleaning up connection');
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

// Custom hook for components that need to listen to specific order updates
export const useOrderSocket = (orderId?: string) => {
  const socket = useSocket();

  // Optional: Listen to specific order updates if orderId is provided
  useEffect(() => {
    if (!socket || !orderId) return;

    const handleSpecificOrderUpdated = (updatedOrder: Order) => {
      if (updatedOrder.id === orderId) {
        console.log('OrderSocket: Specific order updated:', orderId);
        // The order will be updated via React Query invalidation from the centralized handler
      }
    };

    socket.on('orderUpdated', handleSpecificOrderUpdated);

    return () => {
      socket.off('orderUpdated', handleSpecificOrderUpdated);
    };
  }, [socket, orderId]);

  return socket;
}; 