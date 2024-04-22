import React from 'react';
import UsersList from './TertiaryComponents/UsersList';
import UserDetailsPlaceholder from './TertiaryComponents/UserDetailsPlaceholder';
import styles from './UsersViewer.module.css'; 
import useDeviceStore from '../../../stores/useDeviceStore.jsx'
import useSelectedUserStore from '../../../stores/useSelectedUserStore';
import UserDetailsModal from '../../Modal/UserDetailsModal';



/**
 * UsersViewer is a React component designed to display a list of users alongside a placeholder for user details.
 * It primarily acts as a layout component, organizing the user interface into a section for listing users (UsersList)
 * and a dedicated area for displaying selected user details (UserDetailsPlaceholder).
 */


const UsersViewer = () => {
    const { dimensions, setDimensions, isTouch, deviceType, setDeviceType } = useDeviceStore(); 
    const { selectedUser, isModalVisible, clearSelectedUser, setIsModalVisible } = useSelectedUserStore();
    
    const handleOnCLose = () => {
        clearSelectedUser();
        console.log('Closing modal...');
    }

    return (
        <div className={styles.mainContainer}>
            <UsersList />
            {dimensions.width >= 768 && <UserDetailsPlaceholder />}
            {(isModalVisible && dimensions.width < 768) && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={handleOnCLose}
                />
            )}
        </div>
    )
};

export default UsersViewer;
