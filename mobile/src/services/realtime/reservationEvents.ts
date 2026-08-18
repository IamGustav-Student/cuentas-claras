import { getSocket, joinSessionRoom } from "./socket";

// Eventos del algoritmo de prioridad de reserva (CU-02a / RF-08 / EDT 1.1.3.x).
// El servidor es quien arbitra el orden de llegada; el cliente solo emite intenciones
// y reacciona a lo que el servidor decide.
export type ReservationConflictPayload = {
  itemId: string;
  competingParticipantName: string;
};

// Re-exportado para que los hooks puedan importar todo lo relacionado a la sesión en tiempo
// real desde un único módulo.
export { joinSessionRoom };

export function attemptReserve(itemId: string, participantId: string) {
  getSocket().emit("reserve:attempt", { itemId, participantId });
}

export function respondToConflict(itemId: string, participantId: string, insist: boolean) {
  getSocket().emit("reserve:respond", { itemId, participantId, insist });
}

// Nota: los "unsubscribe" devueltos son funciones que retornan `void` a propósito
// (no `Socket`), para poder usarse directamente como cleanup de un useEffect de React.
export function onReservationConflict(cb: (payload: ReservationConflictPayload) => void) {
  getSocket().on("reserve:conflict", cb);
  return () => {
    getSocket().off("reserve:conflict", cb);
  };
}

export function onReservationGranted(cb: (payload: { itemId: string; participantId: string }) => void) {
  getSocket().on("reserve:granted", cb);
  return () => {
    getSocket().off("reserve:granted", cb);
  };
}

export function onItemUpdated(cb: (item: any) => void) {
  getSocket().on("item:updated", cb);
  return () => {
    getSocket().off("item:updated", cb);
  };
}
