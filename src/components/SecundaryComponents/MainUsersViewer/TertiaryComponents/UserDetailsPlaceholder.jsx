import React from 'react';
import styles from './UserDetailsPlaceholder.module.css'; 
import UserDetailsModal from '../../../Modal/UserDetailsModal';
import useSelectedUserStore from '../../../../stores/useSelectedUserStore';
import image from '../../../../assets/placeholderform.png';

/**
 * UserDetailsPlaceholder serves as a visual placeholder or container for displaying selected user details.
 * When a user is selected from the UsersList, this component dynamically updates to show a UserDetailsModal
 * with the selected user's information. If no user is selected (isModalVisible is false), it displays a 
 * default background image, acting as a placeholder.
 */

const UserDetailsPlaceholder = () => {
    const { selectedUser, isModalVisible, clearSelectedUser } = useSelectedUserStore();
    const containerStyle = {
        backgroundImage: isModalVisible ? 'none' : image,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '50%', 
        height: '100%', 
        display: 'flex',
        backgroundColor: 'var(--tertiary-color)',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        flex: 1,
        padding: '0px',
        marginBottom: '20px',
        flexDirection: 'column',
        flexGrow: 1,
        justifySelf: 'center',
        position: 'relative',
    };
    return (
        <div  className={styles.placeholderContainer} style={containerStyle}>
            {isModalVisible && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={clearSelectedUser}
                />
            )}
        </div>
    );
};

export default UserDetailsPlaceholder;
