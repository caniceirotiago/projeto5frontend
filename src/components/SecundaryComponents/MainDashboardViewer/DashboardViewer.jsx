import React from 'react';
import styles from './DashboardViewer.module.css';
import ConfigurationBoard from './TertiaryComponents/ConfigurationBoard';



const DashboardViewer = () => {
    return (
        <div className={styles.mainContainer}>
            <ConfigurationBoard />
        </div>
    )
};

export default DashboardViewer;
