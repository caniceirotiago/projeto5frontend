import React, { useEffect, useRef } from 'react';

export const useNotificationWebSocket = (url, shouldConnect, onMessage) => {
    const ws = useRef(null);

    useEffect(() => {
        if (!shouldConnect) return;

        ws.current = new WebSocket(url);
        console.log('Connecting Notification WebSocket');

        ws.current.onopen = () => {
            console.log('WebSocket Notification Connected', url);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Notification Error:', error);
        };

        ws.current.onmessage = (e) => {
            try {
                const message = JSON.parse(e.data);
                console.log('WebSocket Notification Message:', message);
     
                if(message.type === 'receivedNotification')onMessage(message.data);
            
                
            } catch (error) {
                console.error('Error parsing message:', e.data, error);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                console.log('WebSocket Notification Disconnected', url);
            }
        };
    }, [url, shouldConnect, onMessage]);

    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error("WebSocket Notification is not open.");

        }
    };

    return { sendMessage };
};
