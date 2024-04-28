import React, { useEffect, useState }from "react"
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import style from './UserProfileStatistics.module.css';
import { useIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';

const UserProfileStatistics = ({tasks}) => {
       const intl = useIntl();

    if(tasks === undefined){
        return(
            <>
            Loading...
            </>
        )
    }
    const data = [
        { name: [intl.formatMessage({ id: 'todo' })], value: tasks.todoTasks },
        { name: [intl.formatMessage({ id: 'doing' })], value: tasks.doingTasks },
        { name: [intl.formatMessage({ id: 'done' })], value: tasks.doneTasks },
    ];
    const total = tasks.todoTasks + tasks.doingTasks + tasks.doneTasks;
    const noTasks = data.reduce((acc, curr) => acc + curr.value, 0) === 0;
    const COLORS = ['var(--todo-color)', 'var(--doing-color)', 'var(--done-color)'];

    return (
        <div className={style.graph}>
            {noTasks ? <h3 className={style.h3}><FormattedMessage id="thisUserDoNotHaveTasks">This user do not have tasks</FormattedMessage></h3> :
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
                <h3 className={style.h3}>Total: {total}</h3>

            </ResponsiveContainer>
            }
        </div>
    );
};
export default UserProfileStatistics