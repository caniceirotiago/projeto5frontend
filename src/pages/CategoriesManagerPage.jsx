import React from "react";
import styles from './layout/MainLayout.module.css';
import CategoriesViewer from "../components/SecundaryComponents/MainCategoriesViewer/CategoriesViewer";

/**
 * CategoriesManagerPage Component
 * Renders the page for managing categories, displaying the categories viewer component.
 *
 * Components Used:
 * - CategoriesViewer: Displays the main categories viewer component, allowing users to view
 *   and manage categories within the application. This component may include features such as
 *   adding, editing, or deleting categories, as well as sorting and filtering options for
 *   organizing categories effectively.
 */


const CategoriesManagerPage = () => {
    return (
        <div className={styles.rightContainer}>
            <CategoriesViewer />
        </div>
    );
}
export default CategoriesManagerPage;