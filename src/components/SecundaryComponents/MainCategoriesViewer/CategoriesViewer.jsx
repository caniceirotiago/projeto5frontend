import React from 'react';
import styles from './CategoriesViewer.module.css'; 
import CategoriesBoard from './TertiaryComponents/CategoriesBoard';

/**
 * CategoriesViewer serves as a container component that wraps and displays the CategoriesBoard component. 
 * It primarily acts as a structural component within the application, providing a dedicated space for 
 * category management functionalities facilitated by CategoriesBoard.
 */



const CategoriesViewer = () => {
    return (
        <div className={styles.mainContainer}>
            <CategoriesBoard />
        </div>
    )
};

export default CategoriesViewer;
