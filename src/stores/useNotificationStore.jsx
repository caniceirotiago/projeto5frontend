import {create} from 'zustand';

const useNotificationStore = create((set, get) => ({
    notificationList: [],
    setNotificationList: (notificationList) => set({ notificationList }),
    addNotification: (notification) => set({ notificationList: [...get().notificationList, notification] }),
    removeNotification: (notification) => set({ notificationList: get().notificationList.filter((n) => n !== notification) }),
    clearNotifications: () => set({ notificationList: [] }),
}));
export default useNotificationStore;