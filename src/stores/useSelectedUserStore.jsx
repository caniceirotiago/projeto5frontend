import { create } from 'zustand';

/**
 * useSelectedUserStore (Zustand Store)
 * A store dedicated to managing the state and interactions related to the currently selected user in the UI.
 * This includes handling the visibility of modals related to user actions and managing the need to refresh 
 * the users list after certain operations. Ideal for scenarios where user information needs to be displayed
 * or edited in a detailed modal view.
 */


const useSelectedUserStore = create((set) => ({
  selectedUser: null,
  isModalVisible: false,
  shouldUpdateUsersList: false,
  setSelectedUser: (user) => set({ selectedUser: user }),
  setIsModalVisible: (isVisible) => set({ isModalVisible: isVisible }),
  clearSelectedUser: () => set({ selectedUser: null, isModalVisible: false }),
  triggerUsersListUpdate: () => set((state) => ({ shouldUpdateUsersList: !state.shouldUpdateUsersList })),

}));

export default useSelectedUserStore;
