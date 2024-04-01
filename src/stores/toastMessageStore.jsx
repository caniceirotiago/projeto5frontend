import {create} from 'zustand';

/**
 * useNotificationStore (Zustand Store)
 * This store manages a simple notification system within the application, primarily focusing on handling text messages.
 * It allows components to set a message that can be displayed globally, making it ideal for user feedback or alerts.
 */

const useNotificationStore = create((set, get) => ({
  message: '',
  setMessage: (newMessage) => set(() => ({ message: newMessage })),

}));

export default useNotificationStore;
