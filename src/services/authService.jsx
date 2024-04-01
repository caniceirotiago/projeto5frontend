
/**
 * authService
 * Manages authentication-related operations including login, registration, and logout
 * for users. This service communicates with a REST API backend, handling the necessary
 * requests to authenticate users, create new user accounts, and terminate sessions.
 * It ensures that proper headers are included in each request and processes the server's
 * response, including handling errors by throwing exceptions with meaningful messages.
 */


const API_BASE_URL = "http://localhost:8080/projeto5backend/rest/users";

const login = async (username, password) => {
  let userLogin = { username, password };
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userLogin),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    throw error; 
  }
};

const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Logout failed');
    }
    return await response.json(); 
  } catch (error) {
    throw error;
  }
};



const authService = { login, register, logout};
export { authService };
