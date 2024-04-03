import { create } from 'zustand';


const webSocketNotificationStore = create((set) => ({
    notifications: [], // state variable to keep all notifications
    updateNotifications: (notifications) => set=({notifications}), // a function to update thelist of notifications
    addNotification: (newNotification) => set((state) => ({notifications:
    [...state.notifications, newNotification]})) // a function to add a new notification to thelist of notifications

}));

export default webSocketNotificationStore;
