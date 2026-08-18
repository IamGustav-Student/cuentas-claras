import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import {
  attemptReserve,
  onReservationConflict,
  onReservationGranted,
  respondToConflict,
} from "@/services/realtime/reservationEvents";

// CU-02 + CU-02a: reservar un ítem y manejar el conflicto de reserva simultánea.
export function useReservation() {
  const participantId = useUserStore((s) => s.participantId);
  const [conflict, setConflict] = useState<{ itemId: string; competingParticipantName: string } | null>(null);

  useEffect(() => {
    const off1 = onReservationConflict((payload) => setConflict(payload));
    const off2 = onReservationGranted(() => setConflict(null));
    return () => {
      off1();
      off2();
    };
  }, []);

  const reserve = useCallback(
    (itemId: string) => {
      if (!participantId) return;
      attemptReserve(itemId, participantId);
    },
    [participantId],
  );

  const resolveConflict = useCallback(
    (insist: boolean) => {
      if (!participantId || !conflict) return;
      respondToConflict(conflict.itemId, participantId, insist);
      setConflict(null);
    },
    [participantId, conflict],
  );

  return { conflict, reserve, resolveConflict };
}
