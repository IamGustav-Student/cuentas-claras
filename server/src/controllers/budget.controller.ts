import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { db } from "../db/connection";
import { calculateSessionBalance } from "../services/balance.service";

// RF-13/RF-14.
export const budgetController = {
  contribute(req: Request, res: Response) {
    const { sessionId } = req.params;
    const { participantId, amount } = req.body as { participantId: string; amount: number };

    db.prepare(
      `INSERT INTO budget_contributions (id, session_id, participant_id, amount, created_at) VALUES (?, ?, ?, ?, ?)`,
    ).run(uuid(), sessionId, participantId, amount, new Date().toISOString());

    res.status(201).json({ ok: true });
  },

  getResult(req: Request, res: Response) {
    const balances = calculateSessionBalance(req.params.sessionId);
    res.json(balances);
  },
};
