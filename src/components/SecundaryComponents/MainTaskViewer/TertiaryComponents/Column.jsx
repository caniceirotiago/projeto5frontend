import React from 'react';
import styles from './Column.module.css'; 
import { taskService } from '../../../../services/taskService';
import  useTranslationStore  from '../../../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../../../translations';
import { Droppable } from 'react-beautiful-dnd';



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


const Column = React.memo(({ title, id, children, taskCount, status, updateTasks, onAddTaskClick, setTasks }) => {
    const locale = useTranslationStore((state) => state.locale);


      
            
    return (
      <IntlProvider locale={locale} messages={languages[locale]}>
        <Droppable droppableId={String(status)}>
            {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={styles.column}>
                <div className={styles.header}>
                    <div className={styles.counterInvisible}></div> 
                    <h4><FormattedMessage id={id}></FormattedMessage></h4>
                    <div className={styles.counter}>
                        <div className={styles.counterCircle}>
                        <span key={taskCount}>{taskCount}</span>
                        </div>
                    </div>
                </div>
                <ul className={styles.scrollableUl}
                    status={status}>
                    {children}
                </ul>
                {provided.placeholder}
                {status === "100" && (
                    <button className={styles.addButton} onClick={onAddTaskClick}>
                        <FormattedMessage id="addTask">Add Task</FormattedMessage>
                    </button>
                )} 
            </div>
          )}
        </Droppable>
      </IntlProvider>
    );
});

export default Column;