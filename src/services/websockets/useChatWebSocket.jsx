import React, { useEffect, useRef } from 'react';

export const useChatWebSocket = (url, shouldConnect, onMessage, closeChatModal, updateMessages) => {
    const ws = useRef(null);

    useEffect(() => {
        if (!shouldConnect) return;

        ws.current = new WebSocket(url);
        console.log('Connecting Chat WebSocket');

        ws.current.onopen = () => {
            console.log('WebSocket Chat Connected', url);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Chat Error:', error);
        };

        ws.current.onmessage = (e) => {
            try {
                const message = JSON.parse(e.data);
     
                if(message.type === 'receivedMessage')onMessage(message.data);
                if(message.type === 'markedAsReadMessages'){
                    console.log("Messages marked as read:", message.data);
                    updateMessages(message.data);
                }
                
            } catch (error) {
                console.error('Error parsing message:', e.data, error);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                console.log('WebSocket Chat Disconnected', url);
            }
        };
    }, [url, shouldConnect, onMessage]);

    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error("WebSocket Chat is not open.");
            closeChatModal();

        }
    };

    return { sendMessage };
};
