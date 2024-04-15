import React, { useEffect, useRef } from 'react';

export const useTasksWebSocket = (url, shouldConnect, updateTask, newTask, deleteTask) => {
    const ws = useRef(null);

    useEffect(() => {
        if (!shouldConnect) return;

        ws.current = new WebSocket(url);
        console.log('Connecting Task WebSocket');

        ws.current.onopen = () => {
            console.log('WebSocket Task Connected', url);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Chat Error:', error);
        };

        ws.current.onmessage = (e) => {
            try {
                const message = JSON.parse(e.data);
                if(message.type === 'updatedTask' && !message.data.deleted)updateTask(message.data);
                else if(message.type === 'createTask')newTask(message.data);
                else if(message.type === 'updatedTask'&& message.data.deleted)deleteTask(message.data);
                
            } catch (error) {
                console.error('Error parsing message:', e.data, error);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                console.log('WebSocket Task Disconnected', url);
            }
        };
    }, [url, shouldConnect, updateTask]);

};
