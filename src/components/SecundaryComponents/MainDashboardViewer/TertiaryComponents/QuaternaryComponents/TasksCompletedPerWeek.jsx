import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import statisticsStore from '../../../../../stores/statisticsStore'; 
import { subWeeks, format } from 'date-fns';

const TasksCompletedPerWeek = () => {
    const data = statisticsStore(state => state.tasksPerWeek);

    if (!data) {
        return <p>Loading data...</p>;  
    }

    const date = new Date();
    const last52Weeks = Array.from({ length: 52 }, (_, i) => {
        const weekDate = subWeeks(date, i);
        const weekYear = format(weekDate, 'yyyy');
        const weekNumber = format(weekDate, 'II'); 
        const weekKey = `${weekYear}-W${weekNumber}`;
        return {
            week: `Week ${weekNumber}, ${weekYear}`,
            tasks: data[weekKey] || 0  
        };
    }).reverse();

    return (
        <div>
            <h3>Weekly Task Completion Statistics</h3>
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
                <Legend />
                <Bar dataKey="tasks" fill="#82ca9d" name="Tasks Completed" />
            </BarChart>
        </div>
    );
};

export default TasksCompletedPerWeek;
