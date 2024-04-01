import React from 'react';
import styles from './StatisticsBar.module.css'; 
import useTaskCountStore from '../../../stores/taskCountStore';

/**
 * StatisticsBar displays a visual representation of task distribution across different statuses (TO DO, DOING, DONE)
 * using a bar chart format. It calculates and visualizes the proportion of tasks in each status relative to the total 
 * number of tasks. The component utilizes the useTaskCountStore hook to retrieve the counts of tasks in each status.
 * 
 * Features:
 * - Dynamically calculates the width of each status bar (TO DO, DOING, DONE) based on the proportion of tasks in that status.
 * - Uses CSS variables for bar colors, making it easy to customize the appearance.
 * - Only renders the bar chart if there is at least one task present in any of the statuses, ensuring the component is 
 *   visually meaningful.
 */



const StatisticsBar = () => {
    const todoCount = useTaskCountStore(state => state.newTodoCount);
    const doingCount = useTaskCountStore(state => state.newDoingCount);
    const doneCount = useTaskCountStore(state => state.newDoneCount);

    const totalCount = todoCount + doingCount + doneCount;
    const todoWidth = (todoCount / totalCount) * 100;
    const doingWidth = (doingCount / totalCount) * 100;
    const doneWidth = (doneCount / totalCount) * 100;

    const allTasksNonZero = todoCount !== 0 || doingCount !== 0 || doneCount !== 0;

    if (!allTasksNonZero) {
        return null;
    }
    return (
        <div>
            {allTasksNonZero && (
            <div className={styles.taskBarChart}>
                <div data-testid="todo-bar" className={styles.taskBar} id="todo-bar" style={{width: `${todoWidth}%`, backgroundColor: 'var(--todo-color)'}}></div>
                <div data-testid="doing-bar" className={styles.taskBar} id="doing-bar" style={{width: `${doingWidth}%`, backgroundColor: 'var(--doing-color)'}}></div>
                <div data-testid="done-bar" className={styles.taskBar} id="done-bar" style={{width: `${doneWidth}%`, backgroundColor: 'var(--done-color)'}}></div>
            </div>
            )}
        </div>
    );
};

export default StatisticsBar;
