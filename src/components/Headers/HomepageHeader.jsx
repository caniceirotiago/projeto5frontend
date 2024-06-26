import React, {useEffect, useState, useRef} from 'react';
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
import {useBlobalWebSocket} from '../../services/websockets/useGlobalWebSocket';
import useTranslationStore from '../../stores/useTranslationsStore';
import {IntlProvider, FormattedMessage} from "react-intl";
import languages from '../../translations';
import useDeviceStore from '../../stores/useDeviceStore.jsx'
import "/node_modules/flag-icons/css/flag-icons.min.css";




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
  const { dimensions, setDimensions, isTouch, deviceType, setDeviceType } = useDeviceStore(); 
  const loggedUser = sessionStorage.getItem('username');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationListOpen, setIsNotificationListOpen] = useState(false);
  const navMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const navToggleButtonRef = useRef(null);
  const notificationToggleButtonRef = useRef(null);
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
  const locale = useTranslationStore((state) => state.locale);
  const handleSelectLanguage = (event) => {
    const newLocale = event.target.value;
    updateLocale(newLocale);
  };
  const updateLocale = useTranslationStore((state) => state.updateLocale);
  

  const fetchNotifications = async () => {
    const notifications = await notificationService.getUserNotifications();
    const notificationEntries = Object.entries(notifications).map(([user, notifs]) => [user, notifs]);
    setNotificationMap(new Map(notificationEntries));
  }

  useEffect(() => {
      fetchNotifications();
  }, [ token ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target) &&
        !navToggleButtonRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target) &&
          !notificationToggleButtonRef.current.contains(event.target) && isNotificationListOpen) {
          setIsNotificationListOpen(false);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
        document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isMenuOpen, isNotificationListOpen]); 

  const renderNotifications = () => {
    const entries = [];
    console.log(notificationMap);
    notificationMap.forEach((notifs, user) => {
      console.log(notifs);
      console.log(user);
      const truncateUsername = (username, maxLength) => {
        if (username.length > maxLength) {
          return `${username.substring(0, maxLength)}...`; 
        }
        return username;
      };
      const truncatedUser = truncateUsername(user, 4); 
      
        const mostRecentNotificationHourDate = notifs.length > 0 ? notifs[notifs.length - 1].sentAt : null;
        console.log(mostRecentNotificationHourDate);
        entries.push(
          <IntlProvider locale={locale} messages={languages[locale]}>
            <div key={user} className={styles.notificationItem} onClick={() => handleNotificationClick('message', user)}>
                <span className={styles.notificationCount}>{notifs.length}</span>
                {notifs[0].photoUrl ? <img src={notifs[0].photoUrl} alt="User" className={styles.userImage} /> : null}
                <span className={styles.notificationUsername}>{truncatedUser}</span>
                {mostRecentNotificationHourDate ? ` ${new Date(mostRecentNotificationHourDate).toLocaleString(locale, {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false 
                })}` : 'No messages'}
            </div>
          </IntlProvider>
        );
    });
    if(entries.length === 0) {
        entries.push(
          <IntlProvider locale={locale} messages={languages[locale]}>
              <div key="no-notifications" className={styles.notificationItem}>
                <FormattedMessage id="noNewNotifications">No new notifications</FormattedMessage>
              </div>
          </IntlProvider>
        );
    }
      return entries;
  };
 const markMessageNotificationsAsRead = async (userId) => {
    await notificationService.markMessageNotificationsAsRead(userId);
    fetchNotifications();
  };
  const username = sessionStorage.getItem("username");
  const photoUrl = sessionStorage.getItem("photoUrl") ; 
  const handleNotificationClick = (type, userId) => {
    if (type === 'message') {
      const user = { username: userId };
      openChatModal(user);
      markMessageNotificationsAsRead(userId);
    }
    setIsNotificationListOpen(false);
  };

  const handleToggleNavMenu = (event) => {
    event.stopPropagation(); 
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleNotificationMenu = (event) => {
    event.stopPropagation(); 
    setIsNotificationListOpen(!isNotificationListOpen);
  };

  return (
    <IntlProvider locale={locale} messages={languages[locale]}>
      <header className={styles.header}>
        <div className={styles.logoContainer} onClick={() => navigate('/home')}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
        
        <div className={styles.rightAligned}>
          {dimensions.width >= 768 && 
            <div className={styles.usernameDisplay} onClick={() => navigate(`/userProfile/${loggedUser}`)}>
              {username}
            </div>
          }
          <div className={styles.userPhoto} onClick={() => navigate(`/userProfile/${loggedUser}`)}>
            <img src={photoUrl} alt="User" className={styles.userImage} /> 
          </div>
          <div className={styles.notificationSection}>
            <div  ref={notificationToggleButtonRef} className={styles.notificationBell} onClick = {handleToggleNotificationMenu}>
              <FaBell />
              {totalNotifications === 0 ? null : <div className={styles.notificationNumber}>{totalNotifications}</div>}
            </div>
            {isNotificationListOpen && (
              <div  ref={notificationMenuRef} className={styles.dropdownContent}>
                {renderNotifications()}
              </div>
            )}
          </div>
          <div  ref={navToggleButtonRef} className={styles.menuBurger} onClick={handleToggleNavMenu}>
            <FaBars />
          </div>
          {isMenuOpen && (
            <div  ref={navMenuRef} className={styles.dropdownContent}>
              <div onClick={toggleTheme}>
                {theme === 'dark' ? <FaSun /> : <FaMoon />} {theme === 'dark' ? <FormattedMessage id="lightMode">Light Mode</FormattedMessage> : <FormattedMessage id="darkMode">Dark Mode</FormattedMessage>}
              </div>
              <div className={styles.languageSelection}>
                <select className={styles.languageSelector} onChange={handleSelectLanguage} defaultValue={locale}>
                  {["en", "pt"].map(language => (<option
                  key={language}>{language}</option>))}
                </select>
                {locale === "pt" && <span className={styles.flag} class="fi fi-pt"></span> }
                {locale === "en" && <span className={styles.flag} class="fi fi-gb"></span> }
              </div>
              <div onClick={() => { logout(); navigate('/'); }}>
                <FaSignOutAlt /> <FormattedMessage id="logout">Logout</FormattedMessage>
              </div>
            </div>
          )}
        </div>
      </header>
    </IntlProvider>
  );
};

export default HomepageHeader;
