// src/components/UsersStatistics.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import  statisticsStore  from '../../../../../stores/statisticsStore'; 
import styles from './UsersStatistics.module.css';

const UsersStatistics = () => {
  const { totalUsers, confirmedUsers, unconfirmedUsers, averageTasksPerUser } = statisticsStore((state) => ({
    totalUsers: state.totalUsers,
    confirmedUsers: state.confirmedUsers,
    unconfirmedUsers: state.unconfirmedUsers,
    averageTasksPerUser: state.averageTasksPerUser
  }));

  const data = [
    { name: 'Confirmed Users', value: confirmedUsers },
    { name: 'Unconfirmed Users', value: unconfirmedUsers },
  ];

  const COLORS = ['var(--done-color2)', 'var(--deleted-task-color)'];

  return (
    <div className={styles.statisticsContainer}>
        <h3 className={styles.statisticHeader}>User Statistics</h3>
        <p className={styles.statisticData}>Total Users: {totalUsers}</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.averageTasksPerUser}>
            <h4>Average Tasks Per User</h4>
            <p>{averageTasksPerUser} tasks/user</p>
        </div>
    </div>
  );
};

export default UsersStatistics;
