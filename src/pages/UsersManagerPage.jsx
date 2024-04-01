import React from "react";
import styles from './layout/MainLayout.module.css';
import UsersViewer from "../components/SecundaryComponents/MainUsersViewer/UsersViewer";

const UsersManagerPage = () => {
    return (
        <div className={styles.rightContainer}>
            <UsersViewer />
        </div>
    );
}
export default UsersManagerPage;