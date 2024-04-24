import React from 'react';
import styles from './DashboardViewer.module.css';
import StatisticsBoard from './TertiaryComponents/StatisticsBoard';



const DashboardViewer = () => {
    return (
        <div className={styles.mainContainer}>
            <StatisticsBoard />
        </div>
    )
};

export default DashboardViewer;
