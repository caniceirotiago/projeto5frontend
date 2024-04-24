import React from 'react';
import styles from './UserCard.module.css';
import profileIcon from '../../../../../assets/user.png';
import { useNavigate } from 'react-router-dom';
import  useChatModalStore  from '../../../../../stores/useChatModalStore.jsx';
import { FaComments } from 'react-icons/fa'; 
import NotificationStore from '../../../../../stores/useNotificationStore.jsx';
import { notificationService } from '../../../../../services/notificationService';

/**
 * UserCard is a React component that displays a user's information as a clickable card. 
 * It shows the user's username, profile photo, and role. If the user is marked as deleted, 
 * the card's banner is styled differently to indicate inactive status.
 */


const UserCard = ({ user, onClick  }) => {
    const { setNotificationMap } = NotificationStore();
    const {notificationMap} = NotificationStore();
    const hasNotification = notificationMap.has(user.username);
    console.log(hasNotification);
    const bannerClass = user.deleted ? `${styles.cardBanner} ${styles.cardBannerInactive}` : styles.cardBanner;
    const navigate = useNavigate();
    const onProfileClick = (e) => {
        navigate(`/userProfile/${user.username}`);
        e.stopPropagation(); 
    }
    const { openChatModal } = useChatModalStore();
    const handleOpenChat = async (e) => {
        e.stopPropagation(); 
        openChatModal(user); 
        console.log(user);
        try {
            await notificationService.markMessageNotificationsAsRead(user.username);
            const notifications = await notificationService.getUserNotifications();
            const notificationEntries = Object.entries(notifications).map(([user, notifs]) => [user, notifs]);
            setNotificationMap(new Map(notificationEntries));
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
    };

    return (
        <div className={styles.userCard}  onClick={() => onClick(user)}>
            <div className={bannerClass}>
                <h3>{user.username}</h3>
            </div>
            <div className={styles.cardBody}>
                <div className={styles.userPhotoDiv}>
                    <img src={user.photoURL || 'defaultUserImage.png'} alt={user.username} className={styles.userPhoto} />
                </div>
                <div className={styles.userRoleDiv}>
                   <p>{user.role}</p> 
                </div>
                <div className={styles.actionButtons}>
                    <button className={styles.profileButton} onClick={onProfileClick}>
                        <img src={profileIcon} alt="Profile" />
                    </button>
                    <button className={styles.chatButton} onClick={handleOpenChat}>
                      <FaComments /> 
                    </button>
                     {hasNotification && <div className={styles.notificationDot}></div>}
                </div>
            </div>
        </div>
    );
};

export default UserCard;
