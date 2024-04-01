import {create} from 'zustand';

/**
 * useCategoryStore (Zustand Store)
 * A store dedicated to managing the categories state within the application.
 * It primarily holds a list of categories and provides a method to update this list.
 */


const useCategoryStore = create((set) => ({
  categories: [],
  setCategories: (categories) => set(() => ({ categories })),
}));

export default useCategoryStore;
