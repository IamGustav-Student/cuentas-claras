import { create } from "zustand";
import { ShoppingItem, Participant, Session } from "@/domain/models";

// Estado de la sesión de compra activa en memoria (se hidrata desde SQLite local al entrar,
// ver hooks/useShoppingList.ts, y se actualiza en tiempo real vía sockets).
interface SessionState {
  session: Session | null;
  participants: Participant[];
  items: ShoppingItem[];
  setSession: (session: Session) => void;
  setParticipants: (participants: Participant[]) => void;
  setItems: (items: ShoppingItem[]) => void;
  upsertItem: (item: ShoppingItem) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  participants: [],
  items: [],
  setSession: (session) => set({ session }),
  setParticipants: (participants) => set({ participants }),
  setItems: (items) => set({ items }),
  upsertItem: (item) => {
    const items = get().items.filter((i) => i.id !== item.id);
    set({ items: [...items, item] });
  },
}));
