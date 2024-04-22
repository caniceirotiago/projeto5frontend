import useDomainStore from "../stores/domainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/messages";

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
};

const messageService = {
    getMessagesBetweenUsers: async (sender, receiver) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(sender)}/${encodeURIComponent(receiver)}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
      
            if (response.ok) {
                const messages = await response.json();
                return messages;
            } else {
                console.error("Failed to load messages:", response.statusText);
                return [];
            }
        } catch (error) {
            console.error("Network error when trying to load messages:", error);
            return [];
        }
    },


};

export { messageService };
