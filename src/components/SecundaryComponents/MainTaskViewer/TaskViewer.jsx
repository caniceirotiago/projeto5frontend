import React, { useEffect, useState } from 'react';
import HorizontalSection from './HorizontalSection';
import TasksRow from './TasksRow';
import styles from './TaskViewer.module.css';

/**
 * TaskViewer is a React component designed to organize and display tasks within a structured layout. It aggregates 
 * tasks into a visually coherent interface using the HorizontalSection and TasksRow components. This setup allows for 
 * an organized presentation of tasks, facilitating easy viewing and interaction by the user.
 */

const TaskViewer = () => {
    return (
        <div className={styles.taskViewer}>
            <HorizontalSection />
            <TasksRow /> 
        </div>
    );
};

export default TaskViewer;
