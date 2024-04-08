// src/components/UsersStatistics.jsx
import React, { useEffect } from 'react';
import  {statisticsService}  from '../../../../../services/statisticsService'; // Importe seu serviço de estatísticas
import statisticsStore from '../../../../../stores/statisticsStore'; // Importe sua store de estatísticas

const UsersStatistics = () => {

  const { totalUsers, confirmedUsers, unconfirmedUsers, averageTasksPerUser,  } = statisticsStore((state) => ({
    totalUsers: state.totalUsers,
    confirmedUsers: state.confirmedUsers,
    unconfirmedUsers: state.unconfirmedUsers,
    averageTasksPerUser: state.averageTasksPerUser,
  }));

  return (
    <div>
      <h3>User Statistics</h3>
      <p>Total Users: {totalUsers}</p>
      <p>Confirmed Users: {confirmedUsers}</p>
      <p>Unconfirmed Users: {unconfirmedUsers}</p>
      <p>Average Tasks Per User: {averageTasksPerUser}</p>
    </div>
  );
};

export default UsersStatistics;
