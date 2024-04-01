import React, { useState, useEffect } from 'react';
import styles from './Task.module.css';
import TaskAction from './QuaternaryComponents/TaskAction';
import { taskService } from '../../../../services/taskService';
import toastStore from '../../../../stores/toastMessageStore'; 
import DialogModalStore from '../../../../stores/DialogModalStore';

/**
 * Task is a React component designed to display an individual task's details and allow interaction based on its status
 *  and user permissions.
 * It supports drag-and-drop, and offers contextual actions like delete, move left/right, permanent 
 * deletion, and recycling,
 * contingent on the task's current state and the user's role.
 *
 * Features:
 * - Conditional Rendering: Shows actions (move, delete, etc.) on mouse hover, and restricts certain actions based on user 
 * permissions.
 * - Drag-and-Drop: Enables task reordering within and across columns for status updates.
 * - Dialog Integration: Uses DialogModalStore for confirmations on deletions and recycling, providing a layer of user error 
 * prevention.
 * - Toast Notifications: Uses toastStore to provide user feedback for actions taken on tasks.
 * - Dynamic Styling: Adjusts task presentation based on priority, mode (normal, deleted), and user permissions.
 *
 * Props:
 * - task: Object containing details of the task.
 * - column: The current column/status of the task.
 * - updateTasks: Function to trigger a refresh of tasks upon modification.
 * - handleTaskClick: Function to handle clicks on the task, typically for viewing or editing details.
 * - mode: The mode of the task, indicating if it's in a normal view or deleted view.
 * - updateDeletedTasks: Function to update the list of deleted tasks, used in deleted mode.
 * - username: The username of the task's author, used for permission checks.
 */

const Task = React.memo(({ task, column, updateTasks, handleTaskClick, mode , updateDeletedTasks, username}) => {
  const [showActions, setShowActions] = useState(false); 
  const handleMouseEnter = () => setShowActions(true);
  const handleMouseLeave = () => setShowActions(false);
  const taskStyle = `${styles.taskItem} ${styles[column]} ${styles[mode]}`;
  const bannerStyle = `${styles.banner} ${styles[`${column}Banner`]} ${styles[`${mode}Banner`]}`;
  const [canDelete, setCanDelete] = useState(true);

  useEffect(() => {
    const usernameSS = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role");
    setCanDelete((role === "developer" && username === usernameSS) || role !== "developer");
  }, []);

  const handleDeleteTask = async () => {
    DialogModalStore.getState().setDialogMessage('Are you sure you want to delete this task?');
    DialogModalStore.getState().setIsDialogOpen(true);
    DialogModalStore.getState().setOnConfirm(async () => {
      const updateData = { deleted: true, id: task.id}   
      const result = await taskService.editTask(updateData); 
      if (result) {
        toastStore.getState().setMessage('Task temporarily deleted (' + task.title + ")");
        updateTasks();
      }
    });
  };

  const handleMoveLeft = async () => {
    let newStatus;
    switch(task.status) {
        case 200: 
            newStatus = 100; 
            break;
        case 300: 
            newStatus = 200; 
            break;
        default:
            console.log("Cannot move left from the current status.");
            return;
    }
    const updateData = { status: newStatus, id: task.id}
    const result = await taskService.editTask(updateData);
    if (result) updateTasks();
  };

  const handleMoveRight = async () => {
    let newStatus;
    switch(task.status) {
        case 100:
            newStatus = 200; 
            break;
        case 200: 
            newStatus = 300; 
            break;
        default:
            console.log("Cannot move right from the current status.");
            return;
    }
    const updateData = { status: newStatus, id: task.id}
    const result = await taskService.editTask(updateData);
    if (result) updateTasks();
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('application/reactflow', taskId.toString()); 
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePermDelete = async () => {
    DialogModalStore.getState().setDialogMessage('Are you sure you want to delete this task permanently?');
    DialogModalStore.getState().setIsDialogOpen(true);
    DialogModalStore.getState().setOnConfirm(async () => {
      const result = await taskService.deleteTaskPermanently(task.id);
      if (result) {
        updateDeletedTasks();
        toastStore.getState().setMessage('Task permanently deleted (' + task.title + ")");
      }
    });
  };

  const handleRecycle = async () => {
    DialogModalStore.getState().setDialogMessage('Are you sure you want to recycle this task?');
    DialogModalStore.getState().setIsDialogOpen(true);
    DialogModalStore.getState().setOnConfirm(async () => {
      const updateData = { deleted: false, id: task.id}   
      const result = await taskService.editTask(updateData); 
      if (result) {
        updateDeletedTasks();
        toastStore.getState().setMessage('Task recycled (' + task.title + ")");
      }     
    });   
  };

  const getPriorityClassName = (priority) => {
    switch (priority) {
      case 1:
        return styles['low-priority']; 
      case 2:
        return styles['medium-priority'];
      case 3:
        return styles['high-priority'];
      default:
        return ''; 
    }
  };

  return (
    <li className={`${taskStyle} ${!canDelete && styles['taskItemNoEdit']}`}
      onClick={() => handleTaskClick(task.id)}
      data-task-id={task.id} 
      draggable={true} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onDragStart={(e) => handleDragStart(e, task.id)}>
      <div className={bannerStyle}>
          <div className={styles.titleOnBanner}>
            <div className={styles.titleOnBannerCapsule}>
              <h4>{task.title.length > 9 ? `${task.title.substring(0, 10)}..` : task.title}</h4>
            </div>
          </div>
          <div className={styles.category_author}>
              <h4>{task.category_type.substring(0, 8)}</h4>
          </div>
      </div>
      <div className={styles.content}>
          <p>{task.description.length > 44 ? `${task.description.substring(0, 40)}..` : task.description}</p>
      </div>
      <div className={`${styles.priorityDiv} ${getPriorityClassName(task.priority)}`}></div>
      <div className={getPriorityClassName(task.priority)}></div>
      <TaskAction 
      column={column} 
      isVisible={showActions} 
      onDelete={handleDeleteTask} 
      onMoveLeft={handleMoveLeft} 
      onMoveRight={handleMoveRight}
      onPermDelete={handlePermDelete}
      onRecycle={handleRecycle}
      mode={mode}
      username={username}
      canDelete={canDelete}/>  
    </li>
  );
});

export default Task;