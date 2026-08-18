import { getDb } from "../index";
import { ShoppingItem } from "@/domain/models";

// CU-02/CU-03: reserva, liberación y marcado de compra de ítems.
export const itemRepository = {
  async listBySession(sessionId: string): Promise<ShoppingItem[]> {
    const db = getDb();
    const rows = await db.getAllAsync<any>("SELECT * FROM items WHERE session_id = ? ORDER BY name", [sessionId]);
    return rows.map(mapRow);
  },

  async upsert(item: ShoppingItem): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT INTO items (id, session_id, name, status, reserved_by, observation, price_paid, ticket_image_uri, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         status = excluded.status,
         reserved_by = excluded.reserved_by,
         observation = excluded.observation,
         price_paid = excluded.price_paid,
         ticket_image_uri = excluded.ticket_image_uri,
         updated_at = excluded.updated_at`,
      [
        item.id,
        item.sessionId,
        item.name,
        item.status,
        item.reservedBy,
        item.observation,
        item.pricePaid,
        item.ticketImageUri,
        item.updatedAt,
      ],
    );
  },
};

function mapRow(row: any): ShoppingItem {
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
