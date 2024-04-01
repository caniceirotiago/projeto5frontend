import {create} from 'zustand';
import { authService } from '../services/authService'; 
import  userService  from '../services/userService'; 

/**
 * useAuthStore (Zustand Store)
 * A store to manage authentication states and user information within the application.
 * Provides functionality to handle login, logout, and fetching basic user information.
 * Utilizes the authService and userService for authentication and user data retrieval.
 *
 * State:
 * - token: Holds the authentication token. Null when not logged in.
 *
 * Actions:
 * - login: Asynchronously authenticates a user with username and password. On success,
 *   sets the token, stores it in sessionStorage, fetches basic user info, and stores username.
 * - logout: Clears the authentication token and user info from the store and sessionStorage,
 *   then redirects to the login.
 * - fetchUserBasicInfo: Retrieves basic information of the authenticated user and stores it
 *   in both the zustand store and sessionStorage.
 *
 */


const useAuthStore = create((set,get) => ({
    token: null,

    login: async (username, password) => {
        try {
            const data = await authService.login(username, password);
            set({ token: data.token });
            sessionStorage.setItem('token', data.token); 
            await get().fetchUserBasicInfo(data.token);
            console.log(username);
        } catch (error) {
            console.error("Error during login:", error.message);
            set({ error: 'Login failed. Please check your credentials and try again.', isLoading: false });
        }
    },
    logout: async () => {
        set(() => ({
          token: null,                
        }));
        const result = await authService.logout();
        if(result){
            sessionStorage.clear(); 
        window.location.href = '/'; 
        }
        else {
            console.error("Error during logout");
        }
        
    },
    fetchUserBasicInfo: async () => {
        try {
            const userBasicInfo = await userService.fetchUserBasicInfo(sessionStorage.getItem('token')); 
            console.log(userBasicInfo);
            sessionStorage.setItem("role", userBasicInfo.role);
            sessionStorage.setItem("username", userBasicInfo.username);
            
            set({ userBasicInfo });
        } catch (error) {
            console.error("Error fetching user basic info:", error);
        }
    }
}));

export default useAuthStore;

