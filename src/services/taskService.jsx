import useDomainStore from "../stores/domainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/tasks";

/**
 * taskService
 * This service module provides functionalities for managing tasks in the application. 
 * It interfaces with a REST API backend to perform operations such as fetching, adding, updating, and deleting tasks.
 *  It supports a variety of task-related actions, including handling tasks by user, category, and deletion status 
 * (deleted or not deleted).
 *
 */

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
};

const taskService = {
    getAllTasksNotDeleted: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/?deleted=${encodeURIComponent(false)}`, {
               method: "GET",
               headers: getAuthHeaders(),
            });
      
            if (response.ok) {
               const tasksFromServer = await response.json(); 
                return tasksFromServer;
            } else if ( response.status === 403 || response.status === 400 || response.status === 401) {
               window.location.href = "/";
            } else {
               console.error("Falha ao carregar tarefas:", response.statusText);
            }
         } catch (error) {
            console.error("Erro na rede ao tentar carregar tarefas:", error);
         }
    },
    getAllTasksByUser: async (username) => {
        try {
            const response = await fetch(`${API_BASE_URL}/?username=${encodeURIComponent(username)}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
    
            if (response.ok) {
                const tasks = await response.json();
                return tasks;
            } else if ( response.status === 403 || response.status === 400 || response.status === 401) {
                alert("You don't have permission to access this page. Please login again.");
                window.location.href = "/";
            } else {
                console.error("Failed to load tasks by user:", response.statusText);
            }
        } catch (error) {
            console.error("Network error when trying to load tasks by user:", error);
        }
    },
    
    getAllTasksByCategory: async (category) => {
        try {
            const response = await fetch(`${API_BASE_URL}/?category=${encodeURIComponent(category)}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
    
            if (response.ok) {
                const tasks = await response.json();
                return tasks;
            } else if ( response.status === 403 || response.status === 400 || response.status === 401) {
                alert("You don't have permission to access this page. Please login again.");
                window.location.href = "/";
            } else {
                console.error("Failed to load tasks by category:", response.statusText);
            }
        } catch (error) {
            console.error("Network error when trying to load tasks by category:", error);
        }
    },
    getTasksByUserAndCategory: async (username, category) => {
        try {
            const response = await fetch(`${API_BASE_URL}/?username=${encodeURIComponent(username)}&category=${encodeURIComponent(category)}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
    
            if (response.ok) {
                const tasks = await response.json();
                return tasks;
            } else if ( response.status === 403 || response.status === 400 || response.status === 401) {
                alert("You don't have permission to access this page. Please login again.");
                window.location.href = "/";
            } else {
                console.error("Failed to load tasks by user and category:", response.statusText);
            }
        } catch (error) {
            console.error("Network error when trying to load tasks by user and category:", error);
        }
    },
  
    addTask: async (taskData) => {
        try {
            const response = await fetch(`${API_BASE_URL}`, { 
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(taskData), 
            });
            return response;
        } catch (error) {
            console.error("Network error when trying to add task:", error);
            return { success: false, error: error.toString() };
        }
    },
    getTaskById: async (taskId) => {
        try {
          const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: "GET",
            headers: getAuthHeaders(),
          });
      
          if (response.ok) {
            const task = await response.json();
            return  task ;
          } else if (response.status === 403 || response.status === 400 || response.status === 401) {
            alert("User permissions violated. Please login again.");
            window.location.href = "/";
            return { success: false, error: "User permissions violated" };
          } else if (response.status === 404) {
            alert("Task with this id not found");
            return { success: false, error: "Task with this id not found" };
          } else {
            console.error("Failed to load task by ID:", response.statusText);
            return { success: false, error: response.statusText };
          }
        } catch (error) {
          console.error("Network error when trying to load task by ID:", error);
          return { success: false, error: error.toString() };
        }
      },
      editTask: async (taskData) => {
        console.log("taskData", taskData);

        try {
          const response = await fetch(`${API_BASE_URL}/${taskData.id}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(taskData)
          });
      
          if (response.ok) {
            return { success: true, message: "Task updated successfully." };
          } else if ( response.status === 403 || response.status === 400 || response.status === 401) {
            alert("You don't have permission to access this page. Please login again.");
            window.location.href = "/";
          } else if (response.status === 404) {
            alert("Task with this id not found");
            return { success: false, error: "Task with this id not found" };
          } else {
            const errorMessage = await response.text();
            console.error("Failed to update task:", errorMessage);
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          console.error("Network error when trying to update task:", error);
          return { success: false, error: error.toString() };
        }
      },
      editTaskStatus: async (taskData) => {
        console.log("taskData", taskData);

        try {
          const response = await fetch(`${API_BASE_URL}/status/${taskData.id}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(taskData)
          });
      
          if (response.ok) {
            return { success: true, message: "Task updated successfully." };
          } else if ( response.status === 403 || response.status === 400 || response.status === 401) {
            alert("You don't have permission to access this page. Please login again.");
            window.location.href = "/";
          } else if (response.status === 404) {
            alert("Task with this id not found");
            return { success: false, error: "Task with this id not found" };
          } else {
            const errorMessage = await response.text();
            console.error("Failed to update task:", errorMessage);
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          console.error("Network error when trying to update task:", error);
          return { success: false, error: error.toString() };
        }
      },
      deleteAllTasksByUserTemporarily: async ( username) => {
        try {
            const response = await fetch(`${API_BASE_URL}/temp/all/${encodeURIComponent(username)}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete tasks temporarily: ${errorText}`);
            }
            return true;
        } catch (error) {
            console.error("Error deleting tasks temporarily:", error);
            return false;
        }
    },
    getAllDeletedTasks: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/?deleted=${encodeURIComponent(true)}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
    
            if (response.ok) {
                const deletedTasks = await response.json();
                return deletedTasks;
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to fetch deleted tasks: ${errorText}`);
            }
        } catch (error) {
            console.error("Error fetching deleted tasks:", error);
            return []; 
        }
    },

    deleteTaskPermanently: async (taskId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });
    
            if (response.ok) {
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to permanently delete task: ${errorText}`);
            }
        } catch (error) {
            console.error("Error permanently deleting task:", error);
            return false; 
        }
    },
      
};
export { taskService };
