import React, {useState} from 'react';
import styles from './HorizontalSection.module.css';
import StatisticsBar from './StatisticsBar';
import FiltersComponent from './FiltersComponent';
import searchTermStore from '../../../stores/searchTermMainTasksStore';
import AccessControl from "../../Auth/AcessControl.jsx"
import  useTranslationStore  from '../../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../../translations';
import { FaFilter} from 'react-icons/fa';
import useDeviceStore from '../../../stores/useDeviceStore.jsx'

/**
 * HorizontalSection serves as a composite UI section within a task management interface, integrating 
 * several components that provide filtering, search, and statistical visualization functionalities. 
 * It houses the StatisticsBar for displaying task status distributions, a search input for filtering 
 * tasks based on titles and descriptions, and a FiltersComponent that is conditionally rendered 
 * based on user roles for task filtering.
 */

const HorizontalSection = React.memo(() => {
    const locale = useTranslationStore((state) => state.locale);
    const { dimensions, setDimensions, isTouch, deviceType, setDeviceType } = useDeviceStore(); 
    const [showFilters, setShowFilters] = useState(false);

    const {searchTerm , setSearchTerm } = searchTermStore();

    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <div className={styles.horizontalSection}>
                <div className={styles.searchAndStats}>
                    <StatisticsBar className={styles.statisticsBar}/>
                    <FormattedMessage id="searchTasksPlaceholder">{(searchPlaceholder) => (<input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput} 
                    />)}</FormattedMessage>
                    {dimensions.width < 768 && <FaFilter onClick={() => showFilters === false ? setShowFilters(true): setShowFilters(false)} className={styles.filterIcon}/>}
                </div>
                <AccessControl roles={['productOwner', 'scrumMaster']}>
                    {dimensions.width >= 768 && <FiltersComponent className={styles.filtersComponent}/>}
                    {(dimensions.width < 768 && showFilters) && <FiltersComponent className={styles.filtersComponent}/>}
                </AccessControl>
            </div>
        </IntlProvider>
    );
});

export default HorizontalSection;
