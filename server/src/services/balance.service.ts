import { db } from "../db/connection";

// RF-14/CU-04a: calcula el balance de la sesión en el servidor (fuente de verdad),
// reutilizando la misma lógica que el cliente aplica de forma optimista en domain/balanceCalculator.ts
// (mobile/src/domain/balanceCalculator.ts) para que ambos coincidan.
export function calculateSessionBalance(sessionId: string) {
  const participants = db.prepare("SELECT * FROM participants WHERE session_id = ?").all(sessionId) as any[];
  const items = db
    .prepare("SELECT * FROM items WHERE session_id = ? AND status = 'comprado' AND price_paid IS NOT NULL")
    .all(sessionId) as any[];
  const contributions = db
    .prepare("SELECT * FROM budget_contributions WHERE session_id = ?")
    .all(sessionId) as any[];

  const totalSpent = items.reduce((sum, i) => sum + i.price_paid, 0);
  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
  const noBudgetLoaded = totalContributed === 0;

  return participants.map((p) => {
    const contributed = contributions
      .filter((c) => c.participant_id === p.id)
      .reduce((sum, c) => sum + c.amount, 0);

    const spent = items.filter((i) => i.reserved_by === p.id).reduce((sum, i) => sum + i.price_paid, 0);

    const fairShare = noBudgetLoaded ? totalSpent / (participants.length || 1) : contributed;
    const net = noBudgetLoaded ? spent - fairShare : contributed - spent;

    return {
      participantId: p.id,
      participantName: p.name,
      contributed,
      spent,
      net: Number(net.toFixed(2)),
    };
  });
}
