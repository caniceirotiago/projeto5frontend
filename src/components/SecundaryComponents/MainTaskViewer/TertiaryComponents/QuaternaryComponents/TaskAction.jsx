import React from 'react';
import styles from './TaskAction.module.css';
import deleteIcon from '../../../../../assets/trashCanIcon.png';
import recycleIcon from '../../../../../assets/recycle.png';
import AccessControl from '../../../../Auth/AcessControl';

/**
 * TaskAction presents a set of interactive actions (buttons) for a task, including moving, deleting, and recycling,
 * depending on the task's current status and the operational mode (normal or deleted). Visibility of actions is controlled
 * based on the task's column, user permissions, and whether the task view is in normal or deleted mode.
 *
 * Features:
 * - Conditional Visibility: Actions are shown or hidden based on the task's status, the operational mode, and user permissions.
 * - Move Actions: Allows moving tasks left or right in the workflow (e.g., from TO DO to DOING), available only in normal mode.
 * - Delete Action: Offers a delete option in normal mode and a permanent delete option in deleted mode.
 * - Recycle Action: Available in deleted mode, allowing tasks to be restored to the workflow.
 *
 * Props:
 * - column: Identifies the current column of the task to conditionally render move actions.
 * - isVisible: Controls the visibility of the action buttons.
 * - onDelete: Function to call when the delete action is triggered.
 * - onMoveLeft/Right: Functions to call for moving tasks between columns.
 * - mode: Indicates if the task is in normal view or deleted view, affecting available actions.
 * - onPermDelete: Function for permanent deletion of a task, relevant in deleted mode.
 * - onRecycle: Function to restore a deleted task to the workflow.
 * - username: Username of the task's author, used to check permissions for certain actions.
 * - canDelete: Indicates whether the current user has permission to delete the task.
 *
 * Usage:
 * Embedded within task components to provide contextual actions based on task status, mode, and user permissions.
 */


const TaskAction = ({ column, isVisible, onDelete , onMoveLeft, onMoveRight, mode, onPermDelete, onRecycle, canDelete }) => {
  const isTodoColumn = column === 'todo';
  const isDoneColumn = column === 'done';
  const actionsClass = isVisible ? `${styles.actionsContainer} ${styles.visible}` : styles.actionsContainer;

  return (
    <div className={actionsClass}>
      {!isTodoColumn && mode === "normal"  &&(
        <button className={styles.moveBtn} onClick={(e) => {e.stopPropagation(); onMoveLeft();}}>&lt;</button> // Utiliza "&lt;" para "<"
      )}
      {canDelete && (
        <>{mode === "normal" &&
          <button className={styles.deleteBtn} onClick={(e) => {e.stopPropagation(); onDelete();}}>
            <img src={deleteIcon} alt="Delete" />
          </button>
      }</>)
      }
      {!isDoneColumn && mode === "normal"  &&(
        <button className={styles.moveBtn} onClick={(e) => {e.stopPropagation(); onMoveRight();}}>&gt;</button> // Utiliza "&gt;" para ">"
      )}
      {mode === "deleted" &&
       <AccessControl roles={["productOwner"]}>
        <button className={styles.deleteBtn} onClick={(e) => {e.stopPropagation(); onPermDelete();}}>
          <img src={deleteIcon} alt="Delete" />
        </button>
        </AccessControl>}
      {mode === "deleted" &&
        <button className={styles.recycleBtn} onClick={(e) => {e.stopPropagation(); onRecycle();}}>
          <img src={recycleIcon} alt="Recycle" />
        </button>}

    </div>
  );
};

export default TaskAction;
