import { create } from "zustand";

// Estado simple de conectividad, usado por useOfflineSync para decidir cuándo sincronizar.
interface ConnectivityState {
  isOnline: boolean;
  setOnline: (isOnline: boolean) => void;
}

export const useConnectivityStore = create<ConnectivityState>((set) => ({
  isOnline: true,
  setOnline: (isOnline) => set({ isOnline }),
}));
