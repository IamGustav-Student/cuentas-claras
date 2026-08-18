import { create } from "zustand";

// Identidad del usuario actual dentro de la sesión activa (CU-01: solo se pide el nombre).
interface UserState {
  participantId: string | null;
  name: string | null;
  isHost: boolean;
  setUser: (participantId: string, name: string, isHost: boolean) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  participantId: null,
  name: null,
  isHost: false,
  setUser: (participantId, name, isHost) => set({ participantId, name, isHost }),
  clear: () => set({ participantId: null, name: null, isHost: false }),
}));
