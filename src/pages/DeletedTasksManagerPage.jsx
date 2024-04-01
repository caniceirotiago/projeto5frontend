import React from "react";
import styles from './layout/MainLayout.module.css';
import DeletedTasksViewer from "../components/SecundaryComponents/MainDeletedTasksViewer/DeletedTasksViewer";

/**
 * DeletedTasksManagerPage Component
 * Renders the page for managing deleted tasks, displaying the deleted tasks viewer component.
 *
 * Components Used:
 * - DeletedTasksViewer: Displays the main deleted tasks viewer component, allowing users to view
 *   and potentially restore or permanently delete deleted tasks. This component may include
 *   features such as sorting, filtering, and batch operations on deleted tasks.
 */


const DeletedTasksManagerPage = () => {
    return (
        <div className={styles.rightContainer}>
            <DeletedTasksViewer />
        </div>
    );
}
export default DeletedTasksManagerPage;