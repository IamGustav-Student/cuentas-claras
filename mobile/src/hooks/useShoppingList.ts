import { useCallback, useEffect } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { itemRepository } from "@/database/repositories/itemRepository";
import { onItemUpdated, joinSessionRoom } from "@/services/realtime/reservationEvents";

// Hook central de la pantalla de lista (RF-04..RF-11).
// Estrategia offline-first: primero pinta lo que hay en SQLite local, y luego se mantiene
// al día con los eventos en tiempo real que llegan del backend.
export function useShoppingList(sessionId: string) {
  const items = useSessionStore((s) => s.items);
  const setItems = useSessionStore((s) => s.setItems);
  const upsertItem = useSessionStore((s) => s.upsertItem);

  const loadFromLocalCache = useCallback(async () => {
    const local = await itemRepository.listBySession(sessionId);
    setItems(local);
  }, [sessionId, setItems]);

  useEffect(() => {
    loadFromLocalCache();
    joinSessionRoom(sessionId);

    const unsubscribe = onItemUpdated(async (raw) => {
      await itemRepository.upsert(raw);
      upsertItem(raw);
    });

    return unsubscribe;
  }, [sessionId, loadFromLocalCache, upsertItem]);

  return { items, refresh: loadFromLocalCache };
}
