import React from 'react';
import styles from './UserCard.module.css';
import profileIcon from '../../../../../assets/user.png';
import { useNavigate } from 'react-router-dom';

/**
 * UserCard is a React component that displays a user's information as a clickable card. 
 * It shows the user's username, profile photo, and role. If the user is marked as deleted, 
 * the card's banner is styled differently to indicate inactive status.
 */


const UserCard = ({ user, onClick  }) => {
    const bannerClass = user.deleted ? `${styles.cardBanner} ${styles.cardBannerInactive}` : styles.cardBanner;
    const navigate = useNavigate();
    const onProfileClick = () => {
        navigate(`/userProfile/${user.username}`);
    }

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
                <button className={styles.userProfileBTN} onClick={(e) => {e.stopPropagation(); onProfileClick()}}>
                    <img src={profileIcon} alt="Profile" />
                 </button>
            </div>
        </div>
    );
};

export default UserCard;
