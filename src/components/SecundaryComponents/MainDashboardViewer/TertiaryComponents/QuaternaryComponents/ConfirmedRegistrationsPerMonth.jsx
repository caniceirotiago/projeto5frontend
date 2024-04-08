import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import statisticsStore from '../../../../../stores/statisticsStore'; 

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
        <div>
            <h3>Monthly User Registration Statistics</h3>
            <BarChart
                width={600}
                height={300}
                data={last12Months}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="Users Confirmed" />
            </BarChart>
        </div>
    );
};

export default ConfirmedRegistrationsPerMonth;
