// src/services/websocket/useWebSocket.js
import { useEffect } from 'react';

export const useWebSocket = (url, onMessage) => {
  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      onMessage(event.data);
    };

    ws.onopen = () => console.log("WebSocket connected to", url);
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket disconnected from", url);

    return () => {
      ws.close();
    };
  }, [url, onMessage]);
};
