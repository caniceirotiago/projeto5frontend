import React from "react";
import styles from './layout/MainLayout.module.css';
import DashboardViewer from "../components/SecundaryComponents/MainDashboardViewer/DashboardViewer";


const DashboardPage = () => {
    return (
        <div className={styles.rightContainer}>
            <DashboardViewer />
        </div>
    );
}
export default DashboardPage;