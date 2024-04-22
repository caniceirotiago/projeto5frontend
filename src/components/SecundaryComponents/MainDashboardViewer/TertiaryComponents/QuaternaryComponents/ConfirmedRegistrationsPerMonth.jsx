import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import statisticsStore from '../../../../../stores/statisticsStore'; 
import style from './ConfirmedRegistrationsPerMonth.module.css'

const ConfirmedRegistrationsPerMonth = () => {
    const data = statisticsStore(state => state.usersPerMonth);
    console.log('ConfirmedRegistrationsPerMonth data:', data);

    const date = new Date();
    const currentMonth = date.getMonth(); 
    const currentYear = date.getFullYear();

    const last12Months = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(currentYear, currentMonth - i, 1);
        const monthKey = `${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, '0')}`; 
        console.log('Month key:', monthKey);
        return {
            month: month.toLocaleString('default', { month: 'short', year: 'numeric' }), 
            users: data[monthKey] || 0 
        };
    }).reverse(); 

    return (
        <div className={style.graphic}>
            <h3>Monthly User Registration Statistics</h3>
            <ResponsiveContainer width="100%"  height={200}>
                <LineChart
                    data={last12Months}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ConfirmedRegistrationsPerMonth;
