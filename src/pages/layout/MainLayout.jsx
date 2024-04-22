import React, { useCallback, useEffect } from 'react';
import HomepageAside from '../../components/Asides/HomepageAside';
import HomepageHeader from '../../components/Headers/HomepageHeader';
import HomepageFooter from '../../components/Footers/HomepageFooter';
import styles from './MainLayout.module.css';
import useLayoutStore from '../../stores/layoutStore';
import useAuthStore from '../../stores/authStore';
import {useNotificationWebSocket} from '../../services/websockets/useNotificationWebSocket';
import useNotificationStore from '../../stores/useNotificationStore';
import useDeviceStore from '../../stores/useDeviceStore.jsx'
import HomepageMobileFooter from '../../components/Footers/HomepageMobileFooter.jsx'



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
    const { dimensions, setDimensions, isTouch, deviceType, setDeviceType } = useDeviceStore(); 
    const { isAsideExpanded } = useLayoutStore();
    const onNotification = useCallback((notification) => {
        console.log("Received notification: ", notification);
        useNotificationStore.getState().addNotification(notification.content, notification);
      }, []);
     const wsUrl = `ws://localhost:8080/projeto5backend/notification/${sessionStorage.getItem('token')}`; 
    useNotificationWebSocket(wsUrl, true, onNotification);

    useEffect(() => {
    const handleResize = () => {
        setDimensions(window.innerWidth, window.innerHeight);
        setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop'); 
    };

    window.addEventListener('resize', handleResize);
    handleResize();  

    return () => window.removeEventListener('resize', handleResize);
    }, [setDimensions, setDeviceType]);



    return (
        <div className={styles.main}>
        <HomepageHeader />
            <div className={styles.board}>
                {dimensions.width >= 768 && <HomepageAside />}
                <div className={`${styles.rightContainer} ${isAsideExpanded ? '' : styles.expandedRightContainer}`}>
                    {children}
                </div>               
            </div>
            {dimensions.width >= 768 ? <HomepageFooter /> : <HomepageMobileFooter />}
        </div>
    );
};

export default MainLayout;
