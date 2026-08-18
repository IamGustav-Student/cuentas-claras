import { getDb } from "../index";
import { Session } from "@/domain/models";

// Repositorio: aísla el resto de la app del SQL crudo (buena práctica: capa de acceso a datos).
export const sessionRepository = {
  async upsert(session: Session): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT INTO sessions (id, name, host_name, created_at, closed_at, share_token)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         closed_at = excluded.closed_at`,
      [session.id, session.name, session.hostName, session.createdAt, session.closedAt, session.shareToken],
    );
  },

  async findById(id: string): Promise<Session | null> {
    const db = getDb();
    const row = await db.getFirstAsync<any>("SELECT * FROM sessions WHERE id = ?", [id]);
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      hostName: row.host_name,
      createdAt: row.created_at,
      closedAt: row.closed_at,
      shareToken: row.share_token,
    };
  },

  // RF-04: historial de sesiones anteriores.
  async listAll(): Promise<Session[]> {
    const db = getDb();
    const rows = await db.getAllAsync<any>("SELECT * FROM sessions ORDER BY created_at DESC");
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      hostName: row.host_name,
      createdAt: row.created_at,
      closedAt: row.closed_at,
      shareToken: row.share_token,
    }));
  },
};
