'use client';

import { useSocketEvents } from '@/lib/socket-events';

export const SocketEventsProvider = ({ children }: { children: React.ReactNode }) => {
  // This hook will handle all socket events centrally
  useSocketEvents();
  
  return <>{children}</>;
}; 