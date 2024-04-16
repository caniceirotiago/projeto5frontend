// HomepageAside.jsx
import React, { useEffect , useState} from 'react';
import styles from './HomepageAside.module.css';
import useLayoutStore from '../../stores/layoutStore';
import { FaArrowLeft, FaArrowRight, FaPlus, FaProjectDiagram, FaTasks, FaRunning, FaUsers, FaClipboardList, FaTags, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AccessControl from '../Auth/AcessControl';
import { IntlProvider, FormattedMessage } from "react-intl";
import  useTranslationsStore  from '../../stores/useTranslationsStore';
import languages from '../../translations';


/**
 * HomepageAside Component
 * 
 * Description:
 * Renders an aside component for the homepage, typically used for additional content or navigation.
 * 
 * State Variables:
 * - isAsideExpanded (from layoutStore): Indicates whether the aside component is expanded or collapsed.
 * - showText: Controls the visibility of text within menu items based on the expansion state.
 * 
 * Effects:
 * - useEffect: Sets a timer to update the visibility of text within menu items when the aside expansion state changes.
 * 
 * Hooks:
 * - useLayoutStore: Custom hook to access state and actions related to the layout.
 * 
 * External Dependencies:
 * - react-icons/fa: Provides icons used within the aside component.
 * - react-router-dom: Enables navigation to different pages within the application.
 * - AccessControl: Component for managing access control based on user roles.
 * 
 * Usage:
 * It displays a toggle button to expand or collapse the aside component, along with various menu items for 
 * different functionalities.
 * The visibility of text within menu items is controlled based on the expansion state of the aside component.
 * Access to certain menu items may be restricted based on user roles, managed by the AccessControl component.
 */


const HomepageAside = () => {
    const { isAsideExpanded, toggleAside } = useLayoutStore();
    const [showText, setShowText] = useState(false);
    const locale = useTranslationsStore((state) => state.locale);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowText(isAsideExpanded);
        }, 400); 
        return () => clearTimeout(timer);
    }, [isAsideExpanded]);

    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <aside className={isAsideExpanded ? styles.asideExpanded : styles.asideCollapsed}>
                <button onClick={toggleAside} className={styles.toggleButton}>
                    {isAsideExpanded ? <FaArrowLeft /> : <FaArrowRight />}
                </button>
                <div className={styles.menuItem}>
                    <FaPlus className={styles.icon} />
                    <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="createProject">Create Project</FormattedMessage></span>
                </div>
                <div className={styles.menuItem}>
                    <FaProjectDiagram className={styles.icon} />
                    <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="selectProject">Select Project</FormattedMessage></span>
                </div>
                <div className={styles.menuItem}>
                    <FaTasks className={styles.icon} />
                    <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="backlogManager">Backlog Manager</FormattedMessage></span>
                </div>
                <div className={styles.menuItem}>
                    <FaRunning className={styles.icon} />
                    <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="sprintSelector">Sprint Selector</FormattedMessage></span>
                </div>
                <AccessControl roles={["scrumMaster", "productOwner", "developer"]}>
                    <Link to="/users" className={styles.menuItem}>
                        <FaUsers className={styles.icon} />
                        <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="users">Users</FormattedMessage></span>
                    </Link>
                    <Link to="/tasks" className={styles.menuItem}>
                        <FaClipboardList className={styles.icon} />
                        <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="deletedTasks"> Deleted Tasks</FormattedMessage></span>
                    </Link>
                </AccessControl>  
                <AccessControl roles={["productOwner"]}> 
                    <Link to="/categories" className={styles.menuItem}>
                        <FaTags className={styles.icon} />
                        <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="categories">Categories</FormattedMessage></span>
                    </Link>
                    <Link to="/dashboard" className={styles.menuItem}>
                        <FaChartLine className={styles.icon} />
                        <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="categories">Dashboard</FormattedMessage></span>
                    </Link>
                </AccessControl> 
            </aside>
        </IntlProvider>
    );
};

export default HomepageAside;
