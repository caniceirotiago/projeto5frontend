import React from "react";
import styles from './layout/MainLayout.module.css';
import SettingsViewer from '../components/SecundaryComponents/MainSettingsViewer/SettingsViewer';


const SettingsPage = () => {
    return (
        <div className={styles.rightContainer}>
            <SettingsViewer />
        </div>
    );
}
export default SettingsPage;