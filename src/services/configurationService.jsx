import useDomainStore from "../stores/domainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/config";

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
};

const configurationService = {
    updateConfiguration: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/update`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update configuration: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating configuration:", error.message);
            throw error;
        }
    },

    getConfiguration: async (configKey) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${configKey}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch configuration for key ${configKey}`);
            }

            const data = await response.json();
            return data.configValue;
        } catch (error) {
            console.error(`Error fetching configuration for key ${configKey}:`, error.message);
            throw error;
        }
    },
};

export default configurationService;
