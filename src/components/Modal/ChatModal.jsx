import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageBox, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css'; 
import styles from './ChatModal.module.css';
import useChatModalStore from '../../stores/useChatModalStore';
import {messageService} from '../../services/messageService';
import { parseISO, format } from 'date-fns';
import {useChatWebSocket} from '../../services/websockets/useChatWebSocket';

const ChatModal = () => {
    const { isChatModalOpen, selectedChatUser, closeChatModal } = useChatModalStore();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const wsUrl = `ws://localhost:8080/projeto5backend/chat/${sessionStorage.getItem('token')}`; 

    const handleMessage = useCallback((message) => {
        console.log("Received message: ", message);
        message = {
            ...message,
            position: message.receiverUsername === sessionStorage.getItem('username') ? 'left' : 'right',
            type: 'text',
            text: message.content,
            date: message.sentAt,
            title: message.senderUsername,
            status: message.read ? 'read' : 'sent'
        };
        
        setMessages(prevMessages => [...prevMessages, message]);
        
       if(message.status === "sent" && message.receiverUsername === sessionStorage.getItem('username')) handleMarkAsRead([message]);
    }, []);

    const updateMessages = useCallback((updatedMessages) => {
        console.log("Updating messages with IDs:", updatedMessages.map(m => m.id));
        setMessages(prevMessages => {
            console.log("Current messages:", prevMessages);
            const newMessages = prevMessages.map(msg => {
                const found = updatedMessages.find(updateMsg => updateMsg.id === msg.id);
                if (found) {
                    return {
                        ...msg,
                        status: 'read'
                    };
                }
                return msg;
            });
            console.log("Updated messages:", newMessages);
            return newMessages;
        });
    }, []);
    
    

    
    
    const { sendMessage } = useChatWebSocket(wsUrl, isChatModalOpen, handleMessage, closeChatModal, updateMessages);

    useEffect(() => {
        if (isChatModalOpen && selectedChatUser) {
            setLoading(true);
            messageService.getMessagesBetweenUsers(sessionStorage.getItem('username'), selectedChatUser.username)
                .then(fetchedMessages => {
                    const messagesToUpdate = fetchedMessages.filter(msg => !msg.read);
                    
                    setMessages(fetchedMessages.map(msg => ({
                        ...msg,
                        position: msg.senderUsername === sessionStorage.getItem('username') ? 'right' : 'left', 
                        type: 'text',
                        text: msg.content,
                        date: msg.sentAt,
                        title: msg.senderUsername,
                        status: msg.read ? 'read' : 'sent'
                    })));
                    if(messagesToUpdate.length > 0){
                    
                        handleMarkAsRead(messagesToUpdate);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch messages:', err);
                    setError('Failed to load messages');
                    setLoading(false);
                });
        }
    }, [selectedChatUser, isChatModalOpen]);

    const messagesEndRef = useRef(null); 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();  
    }, [messages]); 

    const handleSendMessage = () => {
        if (inputText.trim()) {
            const now = new Date();
            const formattedDate = now.toISOString().replace(/.\d{3}Z$/, '');  
            const newMessage = {
                senderUsername: sessionStorage.getItem('username'), 
                content: inputText,
                sentAt: formattedDate, 
                receiverUsername: selectedChatUser.username
            };
            const dataToSend = {
                type: 'sendMessage',
                data: newMessage
            };
            sendMessage(dataToSend); 
            setInputText(""); 
            scrollToBottom();
        }
    };
    const handleMarkAsRead = (messagesToUpdate) => {
        const messagesIds = messagesToUpdate.map(msg => msg.id);
        const dataToSend = {
            type: 'markAsRead',
            data: messagesIds
        };
        sendMessage(dataToSend);
        
    };
    

    if (!isChatModalOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={closeChatModal}>&times;</button>
                <h2>Chat with {selectedChatUser.username}</h2>
                <div className={styles.messagesContainer}>
                    {messages.map((msg, index) => (
                        <MessageBox key={index} {...msg} />
                    ))}
                    <div ref={messagesEndRef} />  
                </div>
                <div className={styles.inputArea}>
                <input
                    type="text"
                    placeholder="Type here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className={styles.input}
                    maxLength={1000}
                />
                <Button
                    className={styles.button}
                    text='Send'
                    onClick={handleSendMessage}
                />
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
