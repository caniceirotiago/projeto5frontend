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

  const COLORS = ['var(--todo-color2)', 'var(--doing-color2)'];

  return (
    <div className={styles.statisticsContainer}>
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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={30}
              wrapperStyle={{
                fontSize: '12px', 
                fontWeight: 'bold',
                marginTop: '0px', 
              }}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.numberContainer}>
          {averageTasksPerUser} tasks/user
        </div>

    </div>
  );
};

export default UsersStatistics;
