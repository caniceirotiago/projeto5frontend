import React from 'react';
import styles from './HorizontalSection.module.css';
import StatisticsBar from './StatisticsBar';
import FiltersComponent from './FiltersComponent';
import searchTermStore from '../../../stores/searchTermMainTasksStore';
import AccessControl from "../../Auth/AcessControl.jsx"
import  useTranslationStore  from '../../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../../translations';

/**
 * HorizontalSection serves as a composite UI section within a task management interface, integrating 
 * several components that provide filtering, search, and statistical visualization functionalities. 
 * It houses the StatisticsBar for displaying task status distributions, a search input for filtering 
 * tasks based on titles and descriptions, and a FiltersComponent that is conditionally rendered 
 * based on user roles for task filtering.
 */

const HorizontalSection = React.memo(() => {
    const locale = useTranslationStore((state) => state.locale);

    const {searchTerm , setSearchTerm } = searchTermStore();

    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <div className={styles.horizontalSection}>
                <StatisticsBar />
                <FormattedMessage id="searchTasksPlaceholder">{(searchPlaceholder) => (<input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput} 
                />)}</FormattedMessage>
                <AccessControl roles={['productOwner', 'scrumMaster']}>
                    <FiltersComponent />
                </AccessControl>
            </div>
        </IntlProvider>
    );
});

export default HorizontalSection;
