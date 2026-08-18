import { httpClient } from "./httpClient";
import { ShoppingItem } from "@/domain/models";

// CU-02/CU-02a/CU-03: reservar, liberar, marcar como comprado.
// Los eventos de conflicto de reserva en tiempo real viajan por sockets (ver realtime/reservationEvents.ts);
// estos endpoints REST son la vía "de respaldo" para consultar/actuar cuando no hay socket disponible.
export const itemApi = {
  listBySession: (sessionId: string) => httpClient.get<ShoppingItem[]>(`/sessions/${sessionId}/items`),

  reserve: (itemId: string, participantId: string) =>
    httpClient.post(`/items/${itemId}/reserve`, { participantId }),

  release: (itemId: string, participantId: string) =>
    httpClient.post(`/items/${itemId}/release`, { participantId }),

  markPurchased: (itemId: string, payload: { participantId: string; pricePaid: number }) =>
    httpClient.post(`/items/${itemId}/purchase`, payload),

  attachTicket: (itemId: string, ticketImageUri: string) =>
    httpClient.post(`/items/${itemId}/ticket`, { ticketImageUri }),
};
