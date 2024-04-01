import {create} from 'zustand';

/**
 * searchTermStore (Zustand Store)
 * This store manages the search term state across the application. It provides
 * a mechanism to set and retrieve the current search term, facilitating search
 * functionality throughout the app.
 */


const searchTermStore = create((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));

export default searchTermStore;
