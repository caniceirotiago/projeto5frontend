// src/services/categoryService.jsx
const API_BASE_URL = "http://localhost:8080/projeto5backend/rest/category";

/**
 * categoryService
 * Provides an interface for interacting with the category-related operations on the backend.
 * This includes fetching all categories, fetching categories associated with tasks, adding,
 * editing, and deleting categories. Each method handles API requests, processes the response,
 * and includes error handling. Authorization headers are included in each request to ensure
 * the operations are secured and performed by authenticated users.
 */

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
};

const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/all`, {
               method: "GET",
               headers: getAuthHeaders(),
            });

            if (response.ok) {
               const categoriesFromServer = await response.json(); 
                return categoriesFromServer;
            } else if (response.status === 403) {
               alert("You don't have permission to access this page. Please login again.");
               window.location.href = "index.html"; 
            } else {
               console.error("Falha ao carregar categorias:", response.statusText);
            }
         } catch (error) {
            console.error("Erro na rede ao tentar carregar categorias:", error);
         }
    },
    getCategoriesWithTasks: async () => {
      try {
          const response = await fetch(`${API_BASE_URL}/categoriesWithTasks`, {
              method: "GET",
              headers: getAuthHeaders(),
          });

          if (response.ok) {
              const categories = await response.json();
              return categories;
          } else {
              throw new Error('Failed to fetch categories with tasks');
          }
      } catch (error) {
          console.error("Error fetching categories with tasks:", error);
          throw error;
      }
  },
    addCategory: async (type) => {
        try {
            const response = await fetch(`${API_BASE_URL}/add/${encodeURIComponent(type)}`, {
                method: "POST",
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                const newCategory = await response.json();
                return { success: true, data: newCategory };
            } else {
                const errorMessage = await response.text();
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error("Error adding category:", error);
            return { success: false, error: error.toString() };
        }
    },

    editCategory: async (oldType, newType) => {
        try {
            const response = await fetch(`${API_BASE_URL}/edit/${encodeURIComponent(oldType)}/${encodeURIComponent(newType)}`, {
                method: "PATCH",
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                return { success: true, message: "The category was edited successfully" };
            } else {
                const errorMessage = await response.text();
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error("Error editing category:", error);
            return { success: false, error: error.toString() };
        }
    },

    deleteCategory: async (type) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete/${encodeURIComponent(type)}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                return { success: true, message: "The category was successfully deleted" };
            } else {
                const errorMessage = await response.text();
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            return { success: false, error: error.toString() };
        }
    },
};

export { categoryService };
