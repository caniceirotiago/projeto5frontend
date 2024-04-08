import React from 'react';
import statisticsStore from '../../../../../stores/statisticsStore'; 

const TasksStatistics = () => {
  const { numberOfTODO, numberOfDOING, numberOfDONE, averageCompletionTime } = statisticsStore((state) => ({
    numberOfTODO: state.numberOfTODO,
    numberOfDOING: state.numberOfDOING,
    numberOfDONE: state.numberOfDONE,
    averageCompletionTime: state.averageCompletionTime,
  }));

  return (
    <div>
      <h3>Task Statistics</h3>
      <p>Number of TODO Tasks: {numberOfTODO}</p>
      <p>Number of DOING Tasks: {numberOfDOING}</p>
      <p>Number of DONE Tasks: {numberOfDONE}</p>
      <p>Average Completion Time: {averageCompletionTime}</p>
    </div>
  );
};

export default TasksStatistics;
