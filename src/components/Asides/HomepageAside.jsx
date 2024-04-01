// HomepageAside.jsx
import React, { useEffect , useState} from 'react';
import styles from './HomepageAside.module.css';
import useLayoutStore from '../../stores/layoutStore';
import { FaArrowLeft, FaArrowRight, FaPlus, FaProjectDiagram, FaTasks, FaRunning, FaUsers, FaClipboardList, FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AccessControl from '../Auth/AcessControl';

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowText(isAsideExpanded);
        }, 400); 
        return () => clearTimeout(timer);
    }, [isAsideExpanded]);

    return (
        <aside className={isAsideExpanded ? styles.asideExpanded : styles.asideCollapsed}>
            <button onClick={toggleAside} className={styles.toggleButton}>
                {isAsideExpanded ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
            <div className={styles.menuItem}>
                <FaPlus className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}>Create Project</span>
            </div>
            <div className={styles.menuItem}>
                <FaProjectDiagram className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}>Select Project</span>
            </div>
            <div className={styles.menuItem}>
                <FaTasks className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}>Backlog Manager</span>
            </div>
            <div className={styles.menuItem}>
                <FaRunning className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}>Sprint Selector</span>
            </div>
            <AccessControl roles={["scrumMaster", "productOwner"]}>
                <Link to="/users" className={styles.menuItem}>
                    <FaUsers className={styles.icon} />
                    <span className={showText ? styles.menuText : styles.menuTextHidden}>Users</span>
                </Link>
                <Link to="/tasks" className={styles.menuItem}>
                    <FaClipboardList className={styles.icon} />
                    <span className={showText ? styles.menuText : styles.menuTextHidden}>Deleted Tasks</span>
                </Link>
            </AccessControl>  
            <AccessControl roles={["productOwner"]}> 
                <Link to="/categories" className={styles.menuItem}>
                    <FaTags className={styles.icon} />
                    <span className={showText ? styles.menuText : styles.menuTextHidden}>Categories</span>
                </Link>
            </AccessControl> 
            
        </aside>
    );
};

export default HomepageAside;
