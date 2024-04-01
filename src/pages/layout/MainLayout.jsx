import React, { useEffect } from 'react';
import HomepageAside from '../../components/Asides/HomepageAside';
import HomepageHeader from '../../components/Headers/HomepageHeader';
import HomepageFooter from '../../components/Footers/HomepageFooter';
import styles from './MainLayout.module.css';
import useLayoutStore from '../../stores/layoutStore';
import useAuthStore from '../../stores/authStore';

/**
 * MainLayout Component
 * Renders the main layout for the application, including header, footer, and main content area.
 *
 * Props:
 * - children: The components or content to be rendered within the main content area of the layout.
 *
 * Components Used:
 * - HomepageHeader
 * - HomepageFooter
 * - HomepageAside
 *
 * State Variables:
 * - isAsideExpanded (from layoutStore): Indicates whether the aside component is expanded or collapsed, 
 *  affecting the layout of the main content area.
 *
 * Effect:
 * - useEffect: Executes the fetchUserBasicInfo function from the authStore when the component mounts or 
 * when the token state changes. This is used to fetch user basic information if a token exists but the user 
 * information hasn't been fetched yet.
 *
 * Usage:
 * The MainLayout component serves as the main layout structure for the application, providing a consistent 
 * header, footer, and main content area across different pages. It also manages the expansion/collapse of the 
 * aside component based on the isAsideExpanded state.
 * This layout is typically used for pages where additional content or navigation is required, such as the 
 * homepage or dashboard.
 */


const MainLayout = ({ children }) => {
    const { isAsideExpanded } = useLayoutStore();
    const { fetchUserBasicInfo, token } = useAuthStore();
    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken && !token) {
            fetchUserBasicInfo();
        }
    }, [ token, fetchUserBasicInfo]);
    
    return (
        <div className={styles.main}>
        <HomepageHeader />
            <div className={styles.board}>
                {<HomepageAside />}
                <div className={`${styles.rightContainer} ${isAsideExpanded ? '' : styles.expandedRightContainer}`}>
                    {children}
                </div>               
            </div>
        <HomepageFooter />
        </div>
    );
};

export default MainLayout;
