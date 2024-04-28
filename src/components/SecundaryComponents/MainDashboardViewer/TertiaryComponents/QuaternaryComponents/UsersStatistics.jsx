// src/components/UsersStatistics.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import  statisticsStore  from '../../../../../stores/statisticsStore'; 
import styles from './UsersStatistics.module.css';
import { FormattedMessage } from 'react-intl';
import { IntlProvider, useIntl } from 'react-intl';
import languages from '../../../../../translations';
import  useTranslationStore  from '../../../../../stores/useTranslationsStore';

const UsersStatistics = () => {
  const { totalUsers, confirmedUsers, unconfirmedUsers, averageTasksPerUser } = statisticsStore((state) => ({
    totalUsers: state.totalUsers,
    confirmedUsers: state.confirmedUsers,
    unconfirmedUsers: state.unconfirmedUsers,
    averageTasksPerUser: state.averageTasksPerUser
  }));
  const locale = useTranslationStore((state) => state.locale);
  const intl = useIntl();
  const data = [
    { name: intl.formatMessage({ id: 'confirmedUsers' }), value: confirmedUsers },
    { name: intl.formatMessage({ id: 'unconfirmedUsers' }), value: unconfirmedUsers },
  ];

  const COLORS = ['var(--todo-color2)', 'var(--doing-color2)'];

  return (
    <IntlProvider locale={locale} messages={languages[locale]}>

    <div className={styles.statisticsContainer}>
        <p className={styles.statisticData}><FormattedMessage id="totalUsers">Total Users: </FormattedMessage>
        {totalUsers}</p>
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
          {averageTasksPerUser} <FormattedMessage id="tasks/user">tasks/user</FormattedMessage>
        </div>

    </div>
    </IntlProvider>
  );
};

export default UsersStatistics;
