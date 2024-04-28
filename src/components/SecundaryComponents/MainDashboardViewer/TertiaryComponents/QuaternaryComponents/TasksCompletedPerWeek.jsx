import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import statisticsStore from '../../../../../stores/statisticsStore'; 
import { subWeeks, format } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import { IntlProvider, useIntl } from 'react-intl';
import  useTranslationStore  from '../../../../../stores/useTranslationsStore';
import styles from './TasksCompletedPerWeek.module.css';

const TasksCompletedPerWeek = () => {
    const data = statisticsStore(state => state.tasksPerWeek);
    const locale = useTranslationStore((state) => state.locale);
    const intl = useIntl();
    if (!data) {
        return <p>Loading data...</p>;  
    }

    const date = new Date();
    const last52Weeks = Array.from({ length: 52 }, (_, i) => {
        const weekDate = subWeeks(date, i);
        const weekYear = format(weekDate, 'yyyy');
        const weekNumber = format(weekDate, 'II'); 
        const weekKey = `${weekYear}-W${weekNumber}`;
        const weekLabel = intl.formatMessage({ id: 'weekPrefix' }) + ` ${weekNumber}, ${weekYear}`;  
        return {
            week: weekLabel,
            tasks: data[weekKey] || 0  
        };
    }).reverse();

    return (
        <div className={styles.container}>
            <h3 className={styles.header}><FormattedMessage id="weeklyTaskCompletion">Weekly Task Completion Statistics</FormattedMessage></h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart
                    width={600}
                    height={300}
                    data={last52Weeks}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#82ca9d" name="Tasks Completed" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TasksCompletedPerWeek;
