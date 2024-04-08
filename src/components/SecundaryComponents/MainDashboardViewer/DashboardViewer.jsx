import React from 'react';
import styles from './DashboardViewer.module.css';
import ConfigurationBoard from './TertiaryComponents/ConfigurationBoard';
import StatisticsBoard from './TertiaryComponents/StatisticsBoard';



const DashboardViewer = () => {
    return (
        <div className={styles.mainContainer}>
            <ConfigurationBoard />
            <StatisticsBoard />
        </div>
    )
};

export default DashboardViewer;
