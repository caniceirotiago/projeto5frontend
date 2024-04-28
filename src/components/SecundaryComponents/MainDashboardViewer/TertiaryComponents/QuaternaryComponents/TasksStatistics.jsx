import React from 'react';
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import statisticsStore from '../../../../../stores/statisticsStore';
import styles from './TasksStatistics.module.css'; 
import { FormattedMessage } from 'react-intl';
import { IntlProvider, useIntl } from 'react-intl';
import  useTranslationStore  from '../../../../../stores/useTranslationsStore';


const TasksStatistics = () => {
  const { numberOfTODO, numberOfDOING, numberOfDONE, averageCompletionTime } = statisticsStore((state) => ({
    numberOfTODO: state.numberOfTODO,
    numberOfDOING: state.numberOfDOING,
    numberOfDONE: state.numberOfDONE,
    averageCompletionTime: state.averageCompletionTime
  }));
  const intl = useIntl();
  const locale = useTranslationStore((state) => state.locale);

  const data = [
    {
      name: 'Tasks',
      [intl.formatMessage({ id: 'todo' })]: numberOfTODO,
      [intl.formatMessage({ id: 'doing' })]: numberOfDOING,
      [intl.formatMessage({ id: 'done' })]: numberOfDONE,
    },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.header}><FormattedMessage id="taskStatistics">Task Statistics</FormattedMessage></h3>
      <ResponsiveContainer width="100%"  height={200}>
        <BarChart width={150} height={40} data={data}>
          <Legend />
          <Bar dataKey={intl.formatMessage({ id: 'todo' })} fill="var(--todo-color2)" />
          <Bar dataKey={intl.formatMessage({ id: 'doing' })} fill="var(--doing-color2)" />
          <Bar dataKey={intl.formatMessage({ id: 'done' })} fill="var(--done-color2)" />
        </BarChart>
      </ResponsiveContainer>
      <div className={styles.numberContainer}>
            <p>{averageCompletionTime}</p>
            <p><FormattedMessage id="averageCompletionTime">Average completion Time</FormattedMessage></p>
        </div>
    </div>
  );
};

export default TasksStatistics;
