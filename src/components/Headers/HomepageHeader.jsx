import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../stores/themeStore'; 
import useAuthStore from '../../stores/authStore';
import styles from './HomepageHeader.module.css'; 
import logo from '../../assets/logo.png'; 
import { useLocation } from 'react-router-dom';
import { FaBars, FaMoon, FaSun, FaSignOutAlt, FaBell } from 'react-icons/fa';
import notificationStore from '../../stores/useNotificationStore';
import {notificationService} from '../../services/notificationService';
import useChatModalStore from '../../stores/useChatModalStore';
import {useNotificationWebSocket} from '../../services/websockets/useNotificationWebSocket';


/**
 * HomepageHeader Component
 * 
 * Description:
 * Renders the header component for the homepage, including the logo, navigation menu, user information, and theme switcher.
 * 
 * External Styles:
 * - HomepageHeader.module.css: Stylesheet defining the appearance of the header component.
 * 
 * State Variables:
 * - isMenuOpen (useState): Indicates whether the dropdown menu is open or closed.
 * 
 * Hooks:
 * - useNavigate: Used to programmatically navigate to different pages.
 * - useLocation: Provides access to the current URL location.
 * - useThemeStore: Custom hook from themeStore to manage theme-related state and actions.
 * - useAuthStore: Custom hook from authStore to access user authentication-related state and actions.
 */



const HomepageHeader = () => {
  const loggedUser = sessionStorage.getItem('username');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationListOpen, setIsNotificationListOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const { notificationMap, setNotificationMap } = notificationStore();
  const totalNotifications = Array.from(notificationMap.values()).reduce((acc, list) => acc + list.length, 0);
  const { logout, userBasicInfo, fetchUserBasicInfo, token } = useAuthStore(state => ({
    logout: state.logout,
    userBasicInfo: state.userBasicInfo,
    fetchUserBasicInfo: state.fetchUserBasicInfo,
    token: state.token
  }));
  const { openChatModal } = useChatModalStore();
  

  const fetchNotifications = async () => {
    const notifications = await notificationService.getUserNotifications();
    const notificationEntries = Object.entries(notifications).map(([user, notifs]) => [user, notifs]);
    setNotificationMap(new Map(notificationEntries));
  }

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken && !token) {
           fetchUserBasicInfo();
        }
        fetchNotifications();
    }, [ token, ]);

    const renderNotifications = () => {
      const entries = [];
      notificationMap.forEach((notifs, user) => {
          entries.push(
              <div key={user} className={styles.notificationItem} onClick={() => handleNotificationClick('message', user)}>
                  {user} - {notifs.length} new messages
              </div>
          );
      });
      return entries;
  };
  const markMessageNotificationsAsRead = async (userId) => {
    await notificationService.markMessageNotificationsAsRead(userId);
    fetchNotifications();
  };

  
  const isActive = (path) => {return location.pathname === path;};
  const getNavItemClass = (path) => isActive(path) ? `${styles.navItem} ${styles.active}` : styles.navItem;

  const username = userBasicInfo?.name || "Username";
  const photoUrl = userBasicInfo?.photoUrl || "path/to/default/photo.png"; 

  const handleNotificationClick = (type, userId) => {
    
    if (type === 'message') {
      const user = { username: userId };
      openChatModal(user);
      markMessageNotificationsAsRead(userId);
    }
    setIsNotificationListOpen(false);
  };


  return (
    <header className={styles.header}>
      <div className={styles.logoContainer} onClick={() => navigate('/home')}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>
      <nav className={styles.topnav}>
        <button className={getNavItemClass('/home')} onClick={() => navigate('/home')}>Homepage</button>
      </nav>
      <div className={styles.rightAligned}>
        <div className={styles.usernameDisplay} onClick={() => navigate(`/userProfile/${loggedUser}`)}>
          {username}
        </div>
        <div className={styles.userPhoto} onClick={() => navigate(`/userProfile/${loggedUser}`)}>
          <img src={photoUrl} alt="User" className={styles.userImage} /> 
        </div>
        <div className={styles.notificationSection}>
          <div className={styles.notificationBell} onClick = {() => setIsNotificationListOpen(!isNotificationListOpen)}>
            <FaBell />
            {totalNotifications === 0 ? null : <div className={styles.notificationNumber}>{totalNotifications}</div>}
          </div>
          {isNotificationListOpen && (
            <div className={styles.dropdownContent}>
              {renderNotifications()}
            </div>
          )}
        </div>
        <div className={styles.menuBurger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
           <FaBars />
        </div>
        {isMenuOpen && (
          <div className={styles.dropdownContent}>
            <div onClick={toggleTheme}>
              {theme === 'dark' ? <FaSun /> : <FaMoon />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </div>
            <div onClick={() => { logout(); navigate('/'); }}>
              <FaSignOutAlt /> Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HomepageHeader;
