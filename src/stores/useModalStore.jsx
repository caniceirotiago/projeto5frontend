import {create} from 'zustand';

/**
 * useModalStore (Zustand Store)
 * A store designed to manage the state of modals related to tasks within the application. 
 * It supports opening and closing modals, toggling between view and edit modes, and handling 
 * the selection of tasks for detailed viewing or editing. This centralized state management 
 * allows for a more consistent and controlled modal behavior across the application.
 */


const useModalStore = create((set) => ({
  isModalOpen: false,
  modalMode: 'view', 
  selectedTask: null,
  openModal: (task = null, mode = 'view') => set({
    isModalOpen: true,
    modalMode: mode,
    selectedTask: task,
  }),
  closeModal: () => set({
    isModalOpen: false,
    modalMode: 'view',
    selectedTask: null,
  }),
  toggleModalMode: () => set((state) => ({
    modalMode: state.modalMode === 'view' ? 'edit' : 'view',
  })),
}));

export default useModalStore;
