import {create} from 'zustand';

/**
 * taskCountStore (Zustand Store)
 * This store manages the counts of tasks across different statuses: Todo, Doing, and Done.
 * It serves as a centralized place to track the quantity of tasks in each status, which can be
 * especially useful for displaying summaries or analytics within the application. The store is
 * initialized with zero counts for each status and provides a method to update these counts as tasks
 * progress through their lifecycle.
 */

const taskCountStore = create((set) => ({
    newTodoCount: 0,
    newDoingCount: 0,
    newDoneCount: 0,
    updateCounts: (todoCount, doingCount, doneCount) => {
        set({ newTodoCount: todoCount, 
            newDoingCount: doingCount, 
            newDoneCount: doneCount });
    }
  }),
);

export default taskCountStore;
