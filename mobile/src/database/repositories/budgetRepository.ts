import { getDb } from "../index";
import { BudgetContribution } from "@/domain/models";

// RF-13: sección "Presupuesto" (opcional).
export const budgetRepository = {
  async listBySession(sessionId: string): Promise<BudgetContribution[]> {
    const db = getDb();
    const rows = await db.getAllAsync<any>(
      "SELECT * FROM budget_contributions WHERE session_id = ?",
      [sessionId],
    );
    return rows.map((row) => ({
      id: row.id,
      sessionId: row.session_id,
      participantId: row.participant_id,
      amount: row.amount,
      createdAt: row.created_at,
    }));
  },

  async insert(c: BudgetContribution): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT INTO budget_contributions (id, session_id, participant_id, amount, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [c.id, c.sessionId, c.participantId, c.amount, c.createdAt],
    );
  },
};
