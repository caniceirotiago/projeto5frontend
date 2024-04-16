import {create} from 'zustand';

const useTranslationsStore = create((set) => ({
    locale: "en",
 updateLocale : (locale) => set({locale})
}));

export default useTranslationsStore;

