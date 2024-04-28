import React, { useEffect, useRef } from 'react';
import DialogBoxStore from '../../stores/DialogModalStore';
import useChatModalStore from '../../stores/useChatModalStore';


export const useGlobalWebSocket = (url, shouldConnect, onMessage) => {
    const ws = useRef(null);

    useEffect(() => {
        if (!shouldConnect) return;

        ws.current = new WebSocket(url);
        console.log('Connecting Global WebSocket');

        ws.current.onopen = () => {
            console.log('WebSocket Global Connected', url);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Global Error:', error);
        };

        ws.current.onmessage = (e) => {
            try {
                const message = JSON.parse(e.data);
                console.log('WebSocket Global Message:', message);
                if(message.type === 'receivedNotification')onMessage(message.data);
                else if(message.type ==='forcedLogout') {
                    console.log("forced logout")
                    sessionStorage.clear();
                    useChatModalStore.getState().closeChatModal();
                    DialogBoxStore.getState().setDialogMessage("You have been logged out due to inactivity. Please log in again to continue.");
                    DialogBoxStore.getState().setAlertType(true);
                    DialogBoxStore.getState().setIsDialogOpen(true);
                    DialogBoxStore.getState().setOnConfirm(() => {
                        }
                    );
                }
                
            } catch (error) {
                console.error('Error parsing message:', e.data, error);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                console.log('WebSocket Global Disconnected', url);
            }
        };
    }, [url, shouldConnect, onMessage]);

    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error("WebSocket Global is not open.");

        }
    };

    return { sendMessage };
};
