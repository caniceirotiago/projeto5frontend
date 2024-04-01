import React from 'react';
import styles from './UserCard.module.css';

/**
 * UserCard is a React component that displays a user's information as a clickable card. 
 * It shows the user's username, profile photo, and role. If the user is marked as deleted, 
 * the card's banner is styled differently to indicate inactive status.
 */


const UserCard = ({ user, onClick  }) => {
    const bannerClass = user.deleted ? `${styles.cardBanner} ${styles.cardBannerInactive}` : styles.cardBanner;

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
            </div>
        </div>
    );
};

export default UserCard;
