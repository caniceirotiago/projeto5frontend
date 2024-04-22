import useDomainStore from "../stores/domainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/users";
/**
 * userService
 * Provides an interface to interact with the user-related backend services. It encapsulates
 * the API calls for various user operations such as fetching basic user information, fetching users with tasks,
 * updating user data, changing user passwords, and more. Each method in this service handles the
 * request to the specific endpoint, processes the response, and manages errors appropriately.
 * Note: All requests are authenticated using a token stored in sessionStorage.
 */

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  };

const userService = {
    fetchUserBasicInfo: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/photoandname`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user basic info');
            }

            const data = await response.json();
            return {
                photoUrl: data.photoUrl,
                name: data.name,
                role: data.role,
                username: data.username,
            };
        } catch (error) {
            console.error("Error fetching user basic info:", error.message);
            throw error;
        }
    },

    fetchUsersWithTasks: async () => {       
        try {
            const response = await fetch(`${API_BASE_URL}/withtasks`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch users with tasks');
            }

            const usersWithTasks = await response.json();
            return usersWithTasks;
        } catch (error) {
            console.error("Error fetching users with tasks:", error.message);
            throw error;
        }
    },

    fetchUserInfo: async (profileUsername) => {
        try {
            const response = await fetch(`${API_BASE_URL}/info/${profileUsername}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch user info: ${errorText}`);
            }

            const userInfo = await response.json();
            return userInfo;
        } catch (error) {
            console.error("Error fetching user info:", error.message);
            throw error;
        }
    },
    updateUser: async (updatedUser) => {
        try {
            const response = await fetch(`${API_BASE_URL}/data`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedUser),
            });
            return response; 
        } catch (error) {
            console.error("Error updating user info:", error.message);
            throw error;
        }
    },
    updateUserPassword: async (oldPassword, newPassword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/password`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    password: oldPassword, 
                    newPassword: newPassword, 
                }),
            });
            return response;
        } catch (error) {
            console.error("Error updating password:", error.message);
            throw error;
        }
    },
    fetchAllUsers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch all users');
            }
    
            const users = await response.json();
            return users; 
        } catch (error) {
            console.error("Error fetching all users:", error.message);
            throw error;
        }
    },
    updateUserByUsername: async ( username, updatedUser) => {
        try {
            const response = await fetch(`${API_BASE_URL}/otheruser`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    "userToChangeUsername": username, 
                },
                body: JSON.stringify(updatedUser),
            });
 
            return response; 
        } catch (error) {
            console.error("Error updating user data:", error.message);
            throw error;
        }
    },
    deleteUserPermanently: async ( username) => {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    "userToDeleteUsername": username,
                },
            });
            return response;
        } catch (error) {
            console.error("Error deleting user permanently:", error.message);
            throw error;
        }
    },
    confirmAccount: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/confirm?token=${token}`, {               
                method: "POST", 
                headers: { "Content-Type": "application/json" },
            });
            return response; 
        } catch (error) {
            console.error("Error confirming account:", error.message);
            throw error;
        }
    },
    requestPasswordReset: async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/request-password-reset`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            
            return response;
        } catch (error) {
            console.error("Erro na solicitação de redefinição de senha:", error);
            throw error;
        }
    },
    
    resetPassword: async (token, newPassword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });
            return response;
        } catch (error) {
            console.error("Erro na redefinição de senha:", error);
            throw error;
        }
    },
    requestNewConfirmationEmail: async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/request-confirmation-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            
            return response;
        } catch (error) {
            console.error("Erro ao solicitar novo e-mail de confirmação:", error);
            throw error;
        }
    }
    
};

export default userService;
