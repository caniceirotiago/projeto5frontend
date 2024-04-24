import React, { useEffect, useState, useCallback, useRef } from 'react';
import styles from './TaskRow.module.css'; 
import Column from './TertiaryComponents/Column';
import Task from './TertiaryComponents/Task';
import taskCountStore from '../../../stores/taskCountStore';
import AddTaskModal from '../../Modal/AddTaskModal';
import {taskService} from '../../../services/taskService';
import ViewAndEditTaskModal from '../../Modal/ViewAndEditTaskModal';
import searchTermStore from '../../../stores/searchTermMainTasksStore';
import toastStore from '../../../stores/toastMessageStore';
import  useFiltersStore  from '../../../stores/filterStore';
import {useTasksWebSocket} from '../../../services/websockets/useTasksWebsocket';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useDomainStore from '../../../stores/domainStore';


/**
 * TasksRow is a component that organizes and displays tasks in rows based on their status (TO DO, DOING, DONE). 
 * It integrates with the taskService to fetch and manipulate tasks and employs a filters store to apply 
 * dynamic filtering based on user input or selected categories. It supports adding new tasks and editing 
 * existing ones through modals, offering a comprehensive task management interface.
 * 
 * Features:
 * - Dynamic Task Filtering: Filters tasks based on search terms or selected filters (username, category).
 * - Task Manipulation: Allows for the addition of new tasks and the update of existing tasks via modals, 
 *   with real-time feedback provided by toast notifications.
 * - Task Organization: Categorizes tasks into columns based on their status, providing a clear overview 
 *   of task distribution and progress.
 * 
 * Usage:
 * - Ideal for task management systems or sections within applications that require a detailed and 
 *   interactive view of tasks. It can be particularly useful in project management tools, personal 
 *   organizers, or any platform that benefits from organized task tracking.
 * 
 * Note: This component uses React.memo for optimization, reducing unnecessary re-renders when props 
 * or state haven't changed. It relies on external state management (taskCountStore, searchTermStore, 
 * filterStore) for global state access and manipulation.
 */

const TasksRow = React.memo(() => {
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const openAddTaskModal = () => setIsAddTaskModalOpen(true);
    const closeAddTaskModal = () => setIsAddTaskModalOpen(false);
    const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);
    const openViewTaskModal = () => setIsViewTaskModalOpen(true);
    const closeViewTaskModal = () => setIsViewTaskModalOpen(false);
    const [clickedTask, setClickedTask] = useState({});
    const updateCounts = taskCountStore((state) => state.updateCounts);
    const {searchTerm} = searchTermStore();
    const [tasks, setTasks] = useState([]);
    const { filters } = useFiltersStore(); 
    const [fetchCompleted, setFetchCompleted] = useState(false); 
    const {domain} = useDomainStore();

    /**
     * Fetches tasks based on applied filters and updates the component state with the results. The function
     * queries different functions of the taskService depending on whether filters for username and/or category 
     * are applied. If no filters are set, it fetches all tasks that have not been deleted. The tasks are then 
     * set in the component state, and a flag indicating the completion of the fetch operation is updated.
     * 
     * - Without filters: Fetches all tasks that are not marked as deleted.
     * - Username filter: Fetches tasks created by a specific user.
     * - Category filter: Fetches tasks associated with a specific category.
     * - Username and Category filter: Fetches tasks by a specific user and within a specific category.
     * 
     * Sets the `fetchCompleted` state to `true` upon successful fetching to indicate data is ready for display.
     * Catches and logs any errors encountered during the fetching process to the console.
     */
    
    const fetchTasks = async () => {
        try {
            let fetchedTasks = [];
            if (!filters.username && !filters.category) {
                fetchedTasks = await taskService.getAllTasksNotDeleted();
            } else if (filters.username && !filters.category) {
                fetchedTasks = await taskService.getAllTasksByUser(filters.username);
            } else if (!filters.username && filters.category) {
                fetchedTasks = await taskService.getAllTasksByCategory(filters.category);
            } else if (filters.username && filters.category) {
                fetchedTasks = await taskService.getTasksByUserAndCategory(filters.username, filters.category);
            }
            setTasks(fetchedTasks);
            setFetchCompleted(true);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };
    
    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const updateTaskWS = useCallback((task) => {
        setTasks((prevTasks) => prevTasks.map(t => t.id === task.id ? task : t));
        sortTasks();
    }, [setTasks]);
    const filtersRef = useRef(filters);
    filtersRef.current = filters;
    const newTaskWS = useCallback((task) => {
        if ((filtersRef.current.username && task.username_author !== filtersRef.current.username) ||
            (filtersRef.current.category && task.category_type !== filtersRef.current.category)) {
            return;
        }
        setTasks((prevTasks) => [...prevTasks, task]);
        sortTasks();
    }, [setTasks]); 
    const deleteTaskWS = useCallback((task) => {
        console.log("deleting task", task);
        setTasks((prevTasks) => prevTasks.filter(t => t.id !== task.id));
    }, [setTasks]);
    const deleteTaskpermWS = useCallback((task) => {
    }, [setTasks]);
    const newTaskDeletedBoardWS = useCallback((task) => {
    }, [setTasks]);


    const wsUrl = `ws://${domain}/taskws/${sessionStorage.getItem("token")}`; 
    useTasksWebSocket(wsUrl, true, updateTaskWS, newTaskWS, deleteTaskWS, deleteTaskpermWS, newTaskDeletedBoardWS);
    
    const handleTaskClick = (task) => {
        setClickedTask(task);
        openViewTaskModal();
    }

    /**
     * Organizes tasks into columns based on their status after filtering by search terms. This operation filters tasks 
     * by checking if their title or description contains the searchTerm, then categorizes them into 'todo', 'doing', 
     * or 'done' columns according to their status code. Each task is represented by a Task component, which is 
     * configured with relevant props including a callback for clicks and the task's author username.
     * 
     * - Filters tasks: Searches through titles and descriptions for matches with the searchTerm.
     * - Categorizes tasks: Sorts tasks into columns ('todo', 'doing', 'done') based on their status.
     * - Error handling: Logs an error for tasks with unknown status codes without interrupting the categorization process.
     * 
     * The result is an object with keys for each status containing arrays of Task components ready for rendering. 
     * If no tasks are defined, initializes columns with empty arrays to avoid rendering errors.
     */


    const taskColumns = tasks !== undefined ? tasks
    .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()) 
        || task.description.toLowerCase().includes(searchTerm.toLowerCase())) 
    .reduce((columns, task) => {
        let statusKey;
        switch (task.status) {
            case 100:
                statusKey = 'todo';
                break;
            case 200:
                statusKey = 'doing';
                break;
            case 300:
                statusKey = 'done';
                break;
            default:
                console.error(`Unknown task status: ${task.status}`);
                return columns;
        }
        if (!columns[statusKey]) {
            columns[statusKey] = [];
        }
        columns[statusKey].push(
            <Draggable draggableId={String(task.id)} index={columns[statusKey].length} key={`draggable-${task.id}`}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Task
                            key={task.id}
                            setTasks={setTasks}
                            task={task}
                            column={statusKey}
                            updateTasks={fetchTasks}
                            handleTaskClick={handleTaskClick}
                            mode={"normal"}
                            username={task.username_author}
                        />
                    </div>
                )}
            </Draggable>
        );
        return columns;
    }, { todo: [], doing: [], done: [] }) 
    : { todo: [], doing: [], done: [] };

    const sortTasks = () => {
        setTasks((prevTasks) => prevTasks.sort((a, b) => {
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }
          if (!a.startDate) return 1;
          if (!b.startDate) return -1;
          if (a.startDate !== b.startDate) {
            return new Date(b.startDate) - new Date(a.startDate);
          }
          if (!a.endDate) return 1;
          if (!b.endDate) return -1;
          return new Date(b.endDate) - new Date(a.endDate);
        }));
      };
      

    const handleAddTask = async (taskData) => {
        const response = await taskService.addTask(taskData);
        console.log(response);
        if(response.status === 204){
            //We need to fetch the tasks again to update the state to the new task becouse is de data base that makes an id for the task
            fetchTasks();
            closeAddTaskModal();
            toastStore.getState().setMessage("Task added successfully (" + taskData.title + ")");
        }else {
            toastStore.getState().setMessage("Error adding task. Please try again.");
        }
    };
    const handleUpdateTask = async (taskData) => {
        setTasks((prevTasks) => prevTasks.map(task => task.id === taskData.id ? taskData : task));
        sortTasks();
        const result = await taskService.editTask(taskData);
        console.log(result.success);
        sortTasks(tasks);
        if (result.success) {
            closeViewTaskModal();
            toastStore.getState().setMessage("Task updated successfully (" + taskData.title + ")");
        } else {
            console.error("Erro ao atualizar tarefa:", result.error);
            toastStore.getState().setMessage("Error updating task. Please try again.");
            sortTasks();
        }
    };
    const todoCount = taskColumns.todo.length;
    const doingCount = taskColumns.doing.length;
    const doneCount = taskColumns.done.length;

    useEffect(() => {
        if (fetchCompleted)
        updateCounts(todoCount, doingCount, doneCount);
    }, [tasks,updateCounts, fetchCompleted, todoCount, doingCount, doneCount]);


    const handleOnDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;
        
        const taskId = parseInt(result.draggableId);
        const columnStatus = parseInt(result.destination.droppableId);
        const updateData = { status: columnStatus, id: parseInt(taskId)};
      
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === parseInt(taskId)) {
            return { ...task, status: columnStatus };
          }
          return task;
        }));
        sortTasks();
      
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
            sortTasks();
          }
        } catch (error) {
          console.error('Exception when updating task status:', error);
          sortTasks();
        }
        
    };

    if (!fetchCompleted) {
        return null;
    }
    
    return (    
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <div className={styles.tasksRowContainer}>
                <div className={styles.tasksRow}>
                    <Column title="TO DO" id="todoColumn" status="100" taskCount={todoCount} updateTasks={fetchTasks} onAddTaskClick={openAddTaskModal} setTasks={setTasks}>
                        {taskColumns.todo}
                    </Column>
                    <Column title="DOING" id="doingColumn" status="200" taskCount={doingCount} updateTasks={fetchTasks} setTasks={setTasks}>
                        {taskColumns.doing}
                    </Column>
                    <Column title="DONE" id="doneColumn" status="300" taskCount={doneCount} updateTasks={fetchTasks} setTasks={setTasks}>
                        {taskColumns.done}
                    </Column>                
                        {isAddTaskModalOpen && <AddTaskModal isOpen={isAddTaskModalOpen} onClose={closeAddTaskModal} updateTasks={fetchTasks} onSubmit={handleAddTask} />}
                        {isViewTaskModalOpen && <ViewAndEditTaskModal  isOpen={isViewTaskModalOpen} onClose={closeViewTaskModal} task={(clickedTask)} mode={"normal"} 
                        onSubmit={(taskData) => handleUpdateTask(taskData)} setTasks={setTasks}/>}
                </div>
            </div>
        </DragDropContext>
    );
});
export default TasksRow;