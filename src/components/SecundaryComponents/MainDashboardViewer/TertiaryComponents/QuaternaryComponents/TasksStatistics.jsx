// src/components/TasksStatistics.jsx
import React from 'react';
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import statisticsStore from '../../../../../stores/statisticsStore';
import styles from './TasksStatistics.module.css'; // Ensure you have appropriate styles defined

const TasksStatistics = () => {
  const { numberOfTODO, numberOfDOING, numberOfDONE, averageCompletionTime } = statisticsStore((state) => ({
    numberOfTODO: state.numberOfTODO,
    numberOfDOING: state.numberOfDOING,
    numberOfDONE: state.numberOfDONE,
    averageCompletionTime: state.averageCompletionTime
  }));

  const data = [
    {
      name: 'Tasks',
      TODO: numberOfTODO,
      DOING: numberOfDOING,
      DONE: numberOfDONE,
    },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Task Statistics</h3>
      <ResponsiveContainer width="100%"  height={200}>
        <BarChart width={150} height={40} data={data}>
          <Legend />
          <Bar dataKey="TODO" fill="var(--todo-color2)" />
          <Bar dataKey="DOING" fill="var(--doing-color2)" />
          <Bar dataKey="DONE" fill="var(--done-color2)" />
        </BarChart>
      </ResponsiveContainer>
      <div className={styles.numberContainer}>
            <p>{averageCompletionTime}</p>
            <p>(Average completion Time)</p>
        </div>
    </div>
  );
};

export default TasksStatistics;
