import React from 'react';
import styles from './SettingsViewer.module.css';
import ConfigurationBoard from './TertiaryComponents/ConfigurationBoard';



const SettingsViewer = () => {
    return (
        <div className={styles.mainContainer}>
            <ConfigurationBoard />
        </div>
    )
};

export default SettingsViewer;
