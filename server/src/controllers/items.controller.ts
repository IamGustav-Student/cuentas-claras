import { Request, Response } from "express";
import { db } from "../db/connection";

// RF-05..RF-12: consulta de ítems + marcar como comprado (la reserva/liberación con arbitraje de
// conflictos vive en sockets/reservation.handlers.ts, porque debe resolverse en tiempo real).
export const itemsController = {
  listBySession(req: Request, res: Response) {
    const items = db.prepare("SELECT * FROM items WHERE session_id = ? ORDER BY name").all(req.params.sessionId);
    res.json((items as any[]).map(toCamel));
  },

  markPurchased(req: Request, res: Response) {
    const { itemId } = req.params;
    const { pricePaid } = req.body as { participantId: string; pricePaid: number };

    if (typeof pricePaid !== "number" || pricePaid <= 0) {
      // A2 (CU-03): precio inválido.
      return res.status(400).json({ error: "El precio debe ser un número positivo" });
    }

    db.prepare("UPDATE items SET status = 'comprado', price_paid = ?, updated_at = ? WHERE id = ?").run(
      pricePaid,
      new Date().toISOString(),
      itemId,
    );

    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId);
    res.json(toCamel(item));
  },

  attachTicket(req: Request, res: Response) {
    const { itemId } = req.params;
    const { ticketImageUri } = req.body as { ticketImageUri: string };
    db.prepare("UPDATE items SET ticket_image_uri = ?, updated_at = ? WHERE id = ?").run(
      ticketImageUri,
      new Date().toISOString(),
      itemId,
    );
    res.json({ ok: true });
  },
};

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
