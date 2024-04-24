
/**
 * authService
 * Manages authentication-related operations including login, registration, and logout
 * for users. This service communicates with a REST API backend, handling the necessary
 * requests to authenticate users, create new user accounts, and terminate sessions.
 * It ensures that proper headers are included in each request and processes the server's
 * response, including handling errors by throwing exceptions with meaningful messages.
 */

import useDomainStore from "../stores/domainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/users";

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
    return response;
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
    return response;
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

    return response; 
  } catch (error) {
    throw error;
  }
};



const authService = { login, register, logout};
export { authService };
