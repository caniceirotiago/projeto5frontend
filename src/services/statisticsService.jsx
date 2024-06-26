import useDomainStore from "../stores/domainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/statistics";

/**
 * statisticsService
 * This service module provides functionalities for retrieving statistical data from the application.
 * It interfaces with a REST API backend to perform operations such as fetching user statistics, task statistics, etc.
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

const statisticsService = {
    getDashboardData: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard`, {
               method: "GET",
               headers: getAuthHeaders(),
            });
      
            if (response.ok) {
                const dashboardData = await response.json(); 
                return dashboardData;
            } else if (response.status === 403 || response.status === 400 || response.status === 401) {
                console.error("Access denied. Redirecting to login page.");
                window.location.href = "/";
            } else {
                console.error("Failed to load dashboard data:", response.statusText);
            }
        } catch (error) {
            console.error("Network error when trying to load dashboard data:", error);
        }
    },
    getIndividualUserStatistics: async (username) => {
        console.log("username: " + username);
        try {
            const response = await fetch(`${API_BASE_URL}/individualstats/${username}`, {
               method: "GET",
               headers: getAuthHeaders(),
            });
      
            if (response.ok) {
                const userStatistics = await response.json(); 
                console.log("userStatistics: ", userStatistics);
                return userStatistics;
            } else if (response.status === 403 || response.status === 400 || response.status === 401) {
                console.error("Access denied. Redirecting to login page.");
                window.location.href = "/";
            } else {
                console.error("Failed to load user statistics:", response.statusText);
            }
        } catch (error) {
            console.error("Network error when trying to load user statistics:", error);
        }
    }

};

export { statisticsService };
