import { v4 as uuid } from "uuid";
import { db } from "../db/connection";
import { Server as SocketServer } from "socket.io";

// Algoritmo de prioridad de reserva (EDT 1.1.3.2, RF-08, CU-02a).
// Por qué vive en el servidor y no en cada dispositivo: dos usuarios en dos teléfonos distintos
// pueden tocar "reservar" en el mismo milisegundo. Solo un único árbitro central (este servicio,
// respaldado por la SQLite del backend) puede decidir de forma determinista quién llegó primero.
// Una SQLite puramente local en el cliente no tiene forma de saber lo que pasa en el teléfono de al lado.

interface QueueEntry {
  participantId: string;
  participantName: string;
}

// Colas en memoria por ítem (se reconstruyen si el server reinicia; para un proyecto de este alcance
// es aceptable, ya que las reservas en conflicto se resuelven en segundos).
const queues = new Map<string, QueueEntry[]>();

export function createReservationQueueService(io: SocketServer) {
  function attempt(itemId: string, participantId: string, participantName: string) {
    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId) as any;
    if (!item) return;

    // Ítem libre: se otorga la reserva inmediatamente, sin conflicto.
    if (!item.reserved_by) {
      grant(itemId, participantId);
      return;
    }

    // Ítem ya reservado por este mismo usuario: no hay conflicto.
    if (item.reserved_by === participantId) return;

    // Hay conflicto: se encola el intento y se registra en reservation_attempts (trazabilidad/QA, EDT 1.4.3.1).
    const queue = queues.get(itemId) ?? [];
    queue.push({ participantId, participantName });
    queues.set(itemId, queue);

    db.prepare(
      `INSERT INTO reservation_attempts (id, item_id, participant_id, requested_at, resolved)
       VALUES (?, ?, ?, ?, 0)`,
    ).run(uuid(), itemId, participantId, new Date().toISOString());

    // Se notifica al primero en la fila (quien ya tiene la reserva actual) que hay competencia,
    // pidiéndole confirmación explícita (flujo principal de CU-02a).
    io.to(`session:${item.session_id}`).emit("reserve:conflict", {
      itemId,
      competingParticipantName: participantName,
      currentHolderId: item.reserved_by,
    });
  }

  function respond(itemId: string, participantId: string, insist: boolean) {
    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId) as any;
    if (!item) return;

    if (insist) {
      // A1 no aplica: el titular actual confirma y se queda con la reserva.
      grant(itemId, item.reserved_by);
      queues.set(itemId, []);
      return;
    }

    // A1 (CU-02a): el titular cede. Se le ofrece la reserva al siguiente en la fila.
    const queue = queues.get(itemId) ?? [];
    const next = queue.shift();
    queues.set(itemId, queue);

    if (next) {
      grant(itemId, next.participantId);
    } else {
      // A1.3: no queda nadie más interesado, el ítem queda libre.
      db.prepare("UPDATE items SET reserved_by = NULL, observation = NULL, updated_at = ? WHERE id = ?").run(
        new Date().toISOString(),
        itemId,
      );
      broadcastItem(itemId);
    }
  }

  function grant(itemId: string, participantId: string) {
    const participant = db.prepare("SELECT * FROM participants WHERE id = ?").get(participantId) as any;
    db.prepare(
      `UPDATE items SET reserved_by = ?, observation = ?, updated_at = ? WHERE id = ?`,
    ).run(participantId, `Reservado por ${participant?.name ?? "un participante"}`, new Date().toISOString(), itemId);

    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId) as any;
    io.to(`session:${item.session_id}`).emit("reserve:granted", { itemId, participantId });
    broadcastItem(itemId);
  }

  function release(itemId: string) {
    db.prepare("UPDATE items SET reserved_by = NULL, observation = NULL, updated_at = ? WHERE id = ?").run(
      new Date().toISOString(),
      itemId,
    );
    broadcastItem(itemId);
  }

  function broadcastItem(itemId: string) {
    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId) as any;
    io.to(`session:${item.session_id}`).emit("item:updated", toCamel(item));
  }

  return { attempt, respond, release };
}

function toCamel(row: any) {
  return {
    id: row.id,
    sessionId: row.session_id,
    name: row.name,
    status: row.status,
    reservedBy: row.reserved_by,
    observation: row.observation,
    pricePaid: row.price_paid,
    ticketImageUri: row.ticket_image_uri,
    updatedAt: row.updated_at,
  };
}
