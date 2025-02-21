import { useEffect, useCallback } from 'react';

export const useSocketEvent = (socket, eventName, callback) => {
  const memoizedCallback = useCallback(callback, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, memoizedCallback);

    // Cleanup listener on unmount or when eventName/socket changes
    return () => {
      socket.off(eventName, memoizedCallback);
    };
  }, [socket, eventName, memoizedCallback]);
};