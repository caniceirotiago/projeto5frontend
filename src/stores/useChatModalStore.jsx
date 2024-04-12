// src/stores/useChatModalStore.js
import { create } from 'zustand';

const useChatModalStore = create((set) => ({
  isChatModalOpen: false,
  selectedChatUser: null,
  openChatModal: (user) => set({ isChatModalOpen: true, selectedChatUser: user }),
  closeChatModal: () => set({ isChatModalOpen: false, selectedChatUser: null })
}));

export default useChatModalStore;
