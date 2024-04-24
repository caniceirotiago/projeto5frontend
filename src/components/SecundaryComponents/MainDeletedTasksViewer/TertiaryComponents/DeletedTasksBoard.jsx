import React, { useEffect, useState } from 'react';
import { taskService } from '../../../../services/taskService.jsx'; 
import Task from '../../MainTaskViewer/TertiaryComponents/Task.jsx'; 
import styles from './DeletedTasksBoard.module.css'; 
import ViewAndEditTaskModal from '../../../Modal/ViewAndEditTaskModal.jsx'; 
import { useCallback } from 'react';
import {useTasksWebSocket} from '../../../../services/websockets/useTasksWebsocket';
import useDomainStore from '../../../../stores/domainStore';

/**
 * DeletedTasksBoard is a React component that renders a list of deleted tasks, offering functionalities 
 * such as search and view in detail through a modal. It fetches deleted tasks using the taskService and 
 * allows for interactive search filtering by task title. The component integrates with a modal for viewing 
 * and potentially editing the details of a selected task.
 * 
 * Features:
 * - Fetching and Displaying Deleted Tasks: Automatically fetches deleted tasks on component mount and displays them.
 * - Search Functionality: Includes an input field to filter tasks by title, enhancing usability.
 * - Task Interaction: Clicking on a task opens a modal with more details, allowing for further interaction in a read-only 
 * or edit mode.
 * - Update Mechanism: Offers a method to refresh the list of deleted tasks, ensuring the displayed data is current.
 * 
 * Usage:
 * - This component is suitable for sections within the application dedicated to handling or reviewing tasks that have been
 *  deleted, 
 *   providing users with a means to review or restore them as needed.
 */


const DeletedTasksBoard = () => {
    const [deletedTasks, setDeletedTasks] = useState([]);
    const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);
    const [clickedTask, setClickedTask] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const {domain} = useDomainStore();

    useEffect(() => {
        const fetchDeletedTasks = async () => {
            const token = sessionStorage.getItem('token'); 
            try {
                const fetchedDeletedTasks = await taskService.getAllDeletedTasks(token);
                setDeletedTasks(fetchedDeletedTasks);
            } catch (error) {
                console.error("Failed to fetch deleted tasks:", error);
            }
        };
        fetchDeletedTasks();
    }, []);

    const updateDeletedTasks = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const fetchedDeletedTasks = await taskService.getAllDeletedTasks(token);
            setDeletedTasks(fetchedDeletedTasks);
        } catch (error) {
            console.error("Failed to fetch deleted tasks:", error);
        }
    }
    const handleTaskClick = (task) => {
        setClickedTask(task);
        setIsViewTaskModalOpen(true);
    };
    const updateTaskWS = useCallback((task) => {
    }, []);
    const newTaskWS = useCallback((task) => {
    }, []);
    const deleteTaskWS = useCallback((task) => {
    }, []);
    const deleteTaskFromDeletedBoard = useCallback((task) => {
        setDeletedTasks((prevDeletedTasks) => prevDeletedTasks.filter(t => t.id !== task.id));
    }, [setDeletedTasks]);
    const newTaskOnDeletedBoard = useCallback((task) => {
        setDeletedTasks((prevDeletedTasks) => [...prevDeletedTasks, task]);
    }, [setDeletedTasks]);


    const wsUrl = `ws://${domain}/taskws/${sessionStorage.getItem("token")}`; 
    useTasksWebSocket(wsUrl, true, updateTaskWS, newTaskWS, deleteTaskWS,  deleteTaskFromDeletedBoard, newTaskOnDeletedBoard);

    return (
        <div className={styles.board}>
             <input
                    type="text"
                    placeholder="Search tasks by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput} 
                />
            {deletedTasks.length > 0 ? (
                deletedTasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase())).map((task) => (
                    <Task 
                    key={task.id} 
                    task={task}               
                    updateDeletedTasks={updateDeletedTasks}
                    mode={"deleted"}
                    handleTaskClick={handleTaskClick}
                    />
                ))
            ) : (
                <p>No deleted tasks found.</p>
            )}
            {isViewTaskModalOpen && (
                <ViewAndEditTaskModal
                    isOpen={isViewTaskModalOpen}
                    onClose={() => setIsViewTaskModalOpen(false)}
                    task={clickedTask}
                    mode={"deleted"}
                />
            )}
        </div>
    );
};

export default DeletedTasksBoard;
