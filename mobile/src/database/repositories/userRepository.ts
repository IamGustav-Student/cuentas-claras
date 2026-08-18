import { getDb } from "../index";
import { Participant } from "@/domain/models";

export const userRepository = {
  async listBySession(sessionId: string): Promise<Participant[]> {
    const db = getDb();
    const rows = await db.getAllAsync<any>("SELECT * FROM participants WHERE session_id = ?", [sessionId]);
    return rows.map((row) => ({
      id: row.id,
      sessionId: row.session_id,
      name: row.name,
      isHost: !!row.is_host,
      joinedAt: row.joined_at,
    }));
  },

  async upsert(p: Participant): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT INTO participants (id, session_id, name, is_host, joined_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name`,
      [p.id, p.sessionId, p.name, p.isHost ? 1 : 0, p.joinedAt],
    );
  },
};
