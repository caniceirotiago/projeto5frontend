// src/components/StatisticsBoard.jsx
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

const StatisticsBoard = () => {
  const wsUrl = 'ws://localhost:8080/projeto5backend/dashboard'; 

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
            updateCategoriesStatistics(data.categoryStatistics.categories); 

          }
        };
    
        fetchUserStatistics();
      }, [updateUserStatistics]);
  return (
    <div>
      <h2>Statistics Board</h2>
      <UsersStatistics /> 
      <TasksStatistics />
      <CategoriesStatistics />
      <ConfirmedRegistrationsPerMonth />
      <TasksCompletedPerWeek />
    </div>
  );
};

export default StatisticsBoard;
