import {create} from 'zustand';

const useDomainStore = create((set) => ({
    domain: "localhost:8080/projeto5backend"
}));

export default useDomainStore;
