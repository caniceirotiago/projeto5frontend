import { create } from 'zustand';

/**
 * useFiltersStore (Zustand Store)
 * This store manages the filter states for tasks in the application, including user and category filters.
 * It provides mechanisms to set individual filters, set lists of users and categories associated with tasks,
 * and clear all filters. The store is designed to optimize re-renders by avoiding unnecessary state updates.
 *
 * State:
 * - filters: Object holding the current filter settings (username, category).
 * - usersWithTasks: Array of users that have tasks associated with them.
 * - categoriesWithTasks: Array of categories that have tasks associated with them.
 *
 * Actions:
 * - setFilter: Updates the value of a specified filter; re-renders only if the new value differs.
 * - setUsersWithTasks: Sets the list of users with tasks, avoiding unnecessary updates.
 * - setCategoriesWithTasks: Sets the list of categories with tasks, similarly avoiding redundancy.
 * - clearFilters: Resets all filters to their default state, but only if they are not already default.
 */


const useFiltersStore = create((set) => ({
  filters: {
    username: '',
    category: '',
  },
  usersWithTasks: [],
  categoriesWithTasks: [],
  setFilter: (filterName, value) =>
    set((state) => 
      state.filters[filterName] === value ? state : {
        filters: {
          ...state.filters,
          [filterName]: value,
        },
      }),
  
  setUsersWithTasks: (users) => 
    set((state) => 
      JSON.stringify(state.usersWithTasks) === JSON.stringify(users) ? state : { usersWithTasks: users }
    ),
  
  setCategoriesWithTasks: (categories) => 
    set((state) => 
      JSON.stringify(state.categoriesWithTasks) === JSON.stringify(categories) ? state : { categoriesWithTasks: categories }
    ),
  
  clearFilters: () =>
    set((state) => 
      state.filters.username === '' && state.filters.category === '' ? state : { filters: { username: '', category: '' } }
    ),
}));

export default useFiltersStore;
