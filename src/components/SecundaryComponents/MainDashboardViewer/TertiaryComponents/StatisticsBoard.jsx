
import React, { useEffect } from 'react';
import UsersStatistics from './QuaternaryComponents/UsersStatistics'; 
import TasksStatistics from './QuaternaryComponents/TasksStatistics';
import { statisticsService } from '../../../../services/statisticsService'; 
import statisticsStore from '../../../../stores/statisticsStore'; 
import CategoriesStatistics from './QuaternaryComponents/CategoriesStatistics';
import ConfirmedRegistrationsPerMonth from './QuaternaryComponents/ConfirmedRegistrationsPerMonth';
import TasksCompletedPerWeek from './QuaternaryComponents/TasksCompletedPerWeek';
import { useWebSocket } from '../../../../services/websockets/useWebSocket';
import { handleWebSocketMessage } from '../../../../services/websockets/websocketService';
import style from './StatisticsBoard.module.css'
import useDomainStore from "../../../../stores/domainStore";
import { IntlProvider } from 'react-intl';
import languages from '../../../../translations';
import useTranslationStore from '../../../../stores/useTranslationsStore';

const StatisticsBoard = () => {
  const wsUrl = 'ws:/' + useDomainStore.getState().domain + '/dashboard'; 
  const locale = useTranslationStore((state) => state.locale);
  

  useWebSocket(wsUrl, handleWebSocketMessage);
    const updateUserStatistics = statisticsStore((state) => state.updateUserStatistics);
    const updateTasksStatistics = statisticsStore((state) => state.updateTaskStatistics);
    const updateCategoriesStatistics = statisticsStore((state) => state.updateCategoriesStatistics);

    useEffect(() => {
        const fetchUserStatistics = async () => {
          const data = await statisticsService.getDashboardData(); 
          console.log(data);
          if (data) {
            updateUserStatistics(data.usersStatistics); 
            updateTasksStatistics(data.tasksStatistics);
            console.log(data.categoryStatistics.categories);
            updateCategoriesStatistics(data.categoryStatistics.categories); 

          }
        };
    
        fetchUserStatistics();
      }, [updateUserStatistics]);
  return (
    <IntlProvider locale={locale} messages={languages[locale]}>
      <div className={style.board}>
        
        <div className={style.usersSection}>
          <UsersStatistics /> 
          <ConfirmedRegistrationsPerMonth />
        </div>
        <div className={style.tasksSection}>
          <TasksCompletedPerWeek />
          <TasksStatistics />         
        </div>
        <div className={style.categoriesSection}>
            <CategoriesStatistics />
        </div>
      </div>
    </IntlProvider>
  );
};

export default StatisticsBoard;
