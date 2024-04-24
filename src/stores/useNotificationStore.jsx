import {create} from 'zustand';

const useNotificationStore = create((set) => ({
    notificationMap: new Map(), 
    setNotificationMap: (notificationMap) => set({ notificationMap: new Map(notificationMap) }),
    addNotification: (username, notification) => {
        set((state) => {
            const updatedMap = new Map(state.notificationMap);
            const notifications = updatedMap.get(username) || [];
            notifications.push(notification);
            updatedMap.set(username, notifications);
            return { notificationMap: updatedMap };
        });
    },
    removeNotification: (username, notificationId) => {
        set((state) => {
            const updatedMap = new Map(state.notificationMap);
            const notifications = updatedMap.get(username) || [];
            updatedMap.set(username, notifications.filter(n => n.id !== notificationId));
            return { notificationMap: updatedMap };
        });
    },
    clearNotifications: () => set({ notificationMap: new Map() }),
}));

export default useNotificationStore;
