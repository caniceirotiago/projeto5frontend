import React from 'react';
import UsersList from './TertiaryComponents/UsersList';
import UserDetailsPlaceholder from './TertiaryComponents/UserDetailsPlaceholder';
import styles from './UsersViewer.module.css'; 

/**
 * UsersViewer is a React component designed to display a list of users alongside a placeholder for user details.
 * It primarily acts as a layout component, organizing the user interface into a section for listing users (UsersList)
 * and a dedicated area for displaying selected user details (UserDetailsPlaceholder).
 */


const UsersViewer = () => {
    return (
        <div className={styles.mainContainer}>
            <UsersList />
            <UserDetailsPlaceholder />
        </div>
    )
};

export default UsersViewer;
