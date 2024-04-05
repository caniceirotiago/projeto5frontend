import React from 'react';
import styles from './Column.module.css'; 
import { taskService } from '../../../../services/taskService';

/**
 * Column represents a draggable and droppable column in a task management UI, designed to display tasks 
 * categorized by their status (e.g., TO DO, DOING, DONE). It supports task reassignment through drag-and-drop 
 * actions and provides a visual count of tasks within each category. An 'Add Task' button is conditionally 
 * rendered for specific statuses, facilitating easy task creation.
 * 
 * Features:
 * - Droppable Area
 * - Dynamic Task Count: Displays the number of tasks within the column, updating in real time as tasks are 
 *   added or moved.
 * - Task Addition: Offers an 'Add Task' button for initiating the task creation process, shown based on 
 *   the column's designated status.
 * 
 * Handlers:
 * - handleDragOver: Prevents the default action to allow dropping.
 * - handleDrop: Processes the dropped task, updating its status and refreshing the task list.
 */


const Column = React.memo(({ title, children, taskCount, status, updateTasks, onAddTaskClick, setTasks }) => {
    const handleDragOver = (e) => {
        e.preventDefault(); 
    };
    const handleDrop = async (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('application/reactflow');
        const columnStatus = parseInt(e.currentTarget.getAttribute('status'));
        const updateData = { status: columnStatus, id: parseInt(taskId)};
      
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === parseInt(taskId)) {
            return { ...task, status: columnStatus };
          }
          return task;
        }));
      
        try {
          const result = await taskService.editTask(updateData);
          if (!result.success) {
            setTasks(prevTasks => prevTasks.map(task => {
              if (task.id === parseInt(taskId)) {
                return { ...task, status: parseInt(task.originalStatus) };
              }
              return task;
            }));
            console.error('Error updating task status on the server.');
          }
        } catch (error) {
          console.error('Exception when updating task status:', error);
        }
      };
      
            
    return (
        <div className={styles.column}>
            <div className={styles.header}>
                <div className={styles.counterInvisible}></div> 
                <h4>{title}</h4>
                <div className={styles.counter}>
                    <div className={styles.counterCircle}>
                    <span key={taskCount}>{taskCount}</span>
                    </div>
                </div>
            </div>
            <ul className={styles.scrollableUl}
                status={status}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}>
                {children}
            </ul>
            {status === "100" && (
                <button className={styles.addButton} onClick={onAddTaskClick}>
                    Add Task
                </button>
            )}
        </div>
    );
});

export default Column;
