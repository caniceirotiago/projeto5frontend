import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageBox, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css'; 
import styles from './ChatModal.module.css';
import useChatModalStore from '../../stores/useChatModalStore';
import {messageService} from '../../services/messageService';
import { parseISO, format } from 'date-fns';
import {useChatWebSocket} from '../../services/websockets/useChatWebSocket';
import  useTranslationStore  from '../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../translations';
import useDomainStore from "../../stores/domainStore";


const ChatModal = () => {
    const locale = useTranslationStore((state) => state.locale);

    const { isChatModalOpen, selectedChatUser, closeChatModal } = useChatModalStore();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    

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

    useEffect(() => {
        if (isChatModalOpen && selectedChatUser) {
            setLoading(true);
            messageService.getMessagesBetweenUsers(sessionStorage.getItem('username'), selectedChatUser.username)
                .then(fetchedMessages => {
                    const messagesToUpdate = fetchedMessages.filter(msg => !msg.read && msg.receiverUsername === sessionStorage.getItem('username'));
                    
                    setMessages(fetchedMessages.map(msg => ({
                        ...msg,
                        position: msg.senderUsername === sessionStorage.getItem('username') ? 'right' : 'left', 
                        type: 'text',
                        text: msg.content,
                        date: msg.sentAt,
                        title: msg.senderUsername,
                        status: msg.read ? 'read' : 'sent',
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
    }, [ isChatModalOpen]);
    
    const [wsUrl, setWsUrl] = useState(null);

    useEffect(() => {
        console.log("Selected Chat User:", selectedChatUser);
        if (selectedChatUser && selectedChatUser.username) {
            const newWsUrl = `ws://${useDomainStore.getState().domain}/chat/${sessionStorage.getItem('token')}/${selectedChatUser.username}`;
            setWsUrl(newWsUrl);
        }
    }, [selectedChatUser]);
    
    const { sendMessage } = useChatWebSocket(wsUrl, isChatModalOpen && wsUrl, handleMessage, closeChatModal, updateMessages);
    
    
    
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
        console.log("Marking messages as read:", messagesToUpdate);
        const messagesIds = messagesToUpdate.map(msg => msg.id);
        const dataToSend = {
            type: 'markAsRead',
            data: messagesIds
        };
        sendMessage(dataToSend);
        
    };
    

    if (!isChatModalOpen) return null;

    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <button className={styles.closeButton} onClick={closeChatModal}>&times;</button>
                    <h2><FormattedMessage id="chatWith">Chat with</FormattedMessage> {selectedChatUser.username}</h2>
                    <div className={styles.messagesContainer}>
                        {messages.map((msg, index) => (
                            <MessageBox key={index} {...msg} />
                        ))}
                        <div ref={messagesEndRef} />  
                    </div>
                    <div className={styles.inputArea}>
                    <FormattedMessage id="typeMessagePlaceholder">{(placeholder) => (<input
                        type="text"
                        placeholder={placeholder}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className={styles.input}
                        maxLength={1000}
                    />)}</FormattedMessage>
                    <FormattedMessage id="sendMsgBtn">{(text) => (<Button
                        className={styles.button}
                        text={text}
                        onClick={handleSendMessage}
                    />)}</FormattedMessage>
                    </div>
                </div>
            </div>
        </IntlProvider>
    );
};

export default ChatModal;
