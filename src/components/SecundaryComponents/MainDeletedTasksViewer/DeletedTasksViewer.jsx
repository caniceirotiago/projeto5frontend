import React from 'react';
import styles from './DeletedTasksViewer.module.css'; 
import DeletedTasksBoard from './TertiaryComponents/DeletedTasksBoard';

/**
 * DeletedTasksViewer is a React component designed to encapsulate and display the DeletedTasksBoard component. 
 * It serves as a layout component, providing the necessary structure to present deleted tasks in a user-friendly 
 * manner within the application. The use of CSS modules ensures consistent and isolated styling.
 */

const DeletedTasksViewer = () => {
    return (
        <div className={styles.mainContainer}>
            <DeletedTasksBoard />
        </div>
    )
};

export default DeletedTasksViewer;
