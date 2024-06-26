import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import styles from './CategoriesStatistics.module.css';
import statisticsStore from '../../../../../stores/statisticsStore';
import { FormattedMessage } from 'react-intl';
import { IntlProvider } from 'react-intl';
import languages from '../../../../../translations';
import  useTranslationStore  from '../../../../../stores/useTranslationsStore';


const CategoriesStatistics = () => {
  const rawData = statisticsStore((state) => state.categories);
  const locale = useTranslationStore((state) => state.locale);

  if (rawData.length === 0) {
    return <div>No data available.</div>;
  }
  const categories = Object.entries(rawData).map(([category, taskCount]) => ({
    category: category,
    taskCount: taskCount
  }));
  categories.sort((a, b) => b.taskCount - a.taskCount);

  return (
    <IntlProvider locale={locale} messages={languages[locale]}>
    <div className={styles.container}>
      <h3 className={styles.header}><FormattedMessage id="categoryStatistics">Category Statistics </FormattedMessage></h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={categories}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            bottom: 20,
            left: 70
          }}
        >
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" />
          <Tooltip />
          <Bar dataKey="taskCount" fill="var(--todo-color2)" barSize={9990}>
            <LabelList dataKey="taskCount" position="center" style={{ fill: 'var(--text-color)' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    </IntlProvider>
  );
};

export default CategoriesStatistics;
