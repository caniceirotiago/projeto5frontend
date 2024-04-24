import { create } from 'zustand';

/**
 * statisticsStore (Zustand Store)
 * This store manages the statistical data related to users and tasks within the application.
 * It serves as a centralized place to track user-related statistics such as total users,
 * confirmed users, unconfirmed users, and the average number of tasks per user. The store
 * is initialized with default values for each statistic and provides a method to update
 * these statistics as new data is fetched from the backend.
 */

const statisticsStore = create((set) => ({
  // User statistics
  totalUsers: 0,
  confirmedUsers: 0,
  unconfirmedUsers: 0,
  averageTasksPerUser: 0,
  usersPerMonth: new Map(),
  // Task statistics
  numberOfTODO: 0,
  numberOfDOING: 0,
  numberOfDONE: 0,
  averageCompletionTime: 0,
  tasksPerWeek: new Map(),
  //Categories statistics
  categories: new Map(),
  
  updateUserStatistics: ({totalUsers, confirmedUsers, unconfirmedUsers, averageTasksPerUser, usersPerMonth}) => {
    console.log('Updating user statistics:', { usersPerMonth });
    set({ 
      totalUsers,
      confirmedUsers,
      unconfirmedUsers,
      averageTasksPerUser,
      usersPerMonth,
    });
  },
  updateTaskStatistics: ({ numberOfTODO, numberOfDOING, numberOfDONE, averageCompletionTime ,tasksPerWeek}) => {
    set({ 
      numberOfTODO,
      numberOfDOING,
      numberOfDONE,
      averageCompletionTime, 
      tasksPerWeek,
    });
  },
  updateCategoriesStatistics: (categories) => {
    console.log('Updating category statistics:', { categories });
    set({categories});
  }

}));

export default statisticsStore;
