// HomepageIconFooter.jsx
import React from 'react';
import styles from './HomepageMobileFooter.module.css'; // Adapte os estilos conforme necessário
import { FaUsers, FaClipboardList, FaTags, FaChartLine, FaTasks } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AccessControl from '../Auth/AcessControl.jsx';

/**
 * HomepageIconFooter Component
 * 
 * Description:
 * Renders a footer component for the homepage with icon-only navigation links.
 * 
 * External Dependencies:
 * - react-icons/fa: Provides icons used within the footer component.
 * - react-router-dom: Enables navigation to different pages within the application.
 * - AccessControl: Component for managing access control based on user roles.
 * 
 * Usage:
 * It displays various menu items for different functionalities as icons without text.
 * Access to certain menu items may be restricted based on user roles, managed by the AccessControl component.
 */

const HomepageIconFooter = () => {
    return (
        <footer className={styles.footer}>
            <Link to="/home" className={styles.menuItem}>
                    <FaTasks className={styles.icon} />
                </Link>
            <AccessControl roles={["scrumMaster", "productOwner", "developer"]}>
                <Link to="/users" className={styles.menuItem}>
                    <FaUsers className={styles.icon} />
                </Link>
                <Link to="/tasks" className={styles.menuItem}>
                    <FaClipboardList className={styles.icon} />
                </Link>
            </AccessControl>
            <AccessControl roles={["productOwner"]}>
                <Link to="/categories" className={styles.menuItem}>
                    <FaTags className={styles.icon} />
                </Link>
                <Link to="/dashboard" className={styles.menuItem}>
                    <FaChartLine className={styles.icon} />
                </Link>
            </AccessControl>
        </footer>
    );
};

export default HomepageIconFooter;
