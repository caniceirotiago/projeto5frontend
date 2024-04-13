// src/services/messageService.js
const API_BASE_URL = "http://localhost:8080/projeto5backend/rest/notification";

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
};

const notificationService = {
    getUserNotifications: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
      
            if (response.ok) {
                const notifications = await response.json();
                return notifications;
            } else {
                console.error("Failed to load motifications:", response.statusText);
                return [];
            }
        } catch (error) {
            console.error("Network error when trying to load notifications:", error);
            return [];
        }
    },


};

export { notificationService };