import React from 'react';
import styles from './HorizontalSection.module.css';
import StatisticsBar from './StatisticsBar';
import FiltersComponent from './FiltersComponent';
import searchTermStore from '../../../stores/searchTermMainTasksStore';
import AccessControl from "../../Auth/AcessControl.jsx"

/**
 * HorizontalSection serves as a composite UI section within a task management interface, integrating 
 * several components that provide filtering, search, and statistical visualization functionalities. 
 * It houses the StatisticsBar for displaying task status distributions, a search input for filtering 
 * tasks based on titles and descriptions, and a FiltersComponent that is conditionally rendered 
 * based on user roles for task filtering.
 */

const HorizontalSection = React.memo(() => {
    const {searchTerm , setSearchTerm } = searchTermStore();

    return (
        <div className={styles.horizontalSection}>
            <StatisticsBar />
            <input
                type="text"
                placeholder="Search tasks by title and description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput} 
            />
            <AccessControl roles={['productOwner', 'scrumMaster']}>
                <FiltersComponent />
            </AccessControl>
        </div>
    );
});

export default HorizontalSection;
