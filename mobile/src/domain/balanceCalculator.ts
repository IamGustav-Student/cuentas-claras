import { BalanceEntry, BudgetContribution, Participant, SettlementTransfer, ShoppingItem } from "./models";

// Motor de cálculo de gastos y balances (RF-14, CU-04/CU-04a, EDT 1.1.4.2).
// 1) net = aportado - gastado, por participante.
// 2) Si nadie cargó "Presupuesto" (RF-13 es opcional), se reparte el total en partes iguales (ver A2 de CU-04).
// 3) Se simplifican las deudas con un algoritmo greedy (minimiza cantidad de transferencias).

export function calculateBalance(
  participants: Participant[],
  items: ShoppingItem[],
  contributions: BudgetContribution[],
): BalanceEntry[] {
  const purchased = items.filter((i) => i.status === "comprado" && i.pricePaid != null);
  const totalSpent = purchased.reduce((sum, i) => sum + (i.pricePaid ?? 0), 0);
  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
  const noBudgetLoaded = totalContributed === 0;

  return participants.map((p) => {
    const contributed = contributions
      .filter((c) => c.participantId === p.id)
      .reduce((sum, c) => sum + c.amount, 0);

    const spentByThisUser = purchased
      .filter((i) => i.reservedBy === p.id)
      .reduce((sum, i) => sum + (i.pricePaid ?? 0), 0);

    // Sin presupuesto cargado: el total se reparte en partes iguales entre los participantes (A2, CU-04).
    const fairShare = noBudgetLoaded ? totalSpent / (participants.length || 1) : contributed;

    const net = noBudgetLoaded
      ? spentByThisUser - fairShare
      : contributed - spentByThisUser;

    return {
      participantId: p.id,
      participantName: p.name,
      contributed,
      spent: spentByThisUser,
      net: Number(net.toFixed(2)),
    };
  });
}

// Simplificación de deudas: empareja deudores (net < 0) con acreedores (net > 0).
export function simplifySettlement(balances: BalanceEntry[]): SettlementTransfer[] {
  const debtors = balances.filter((b) => b.net < 0).map((b) => ({ ...b })).sort((a, b) => a.net - b.net);
  const creditors = balances.filter((b) => b.net > 0).map((b) => ({ ...b })).sort((a, b) => b.net - a.net);

  const transfers: SettlementTransfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(-debtor.net, creditor.net);

    if (amount > 0.01) {
      transfers.push({
        fromParticipantId: debtor.participantId,
        toParticipantId: creditor.participantId,
        amount: Number(amount.toFixed(2)),
      });
    }

    debtor.net += amount;
    creditor.net -= amount;

    if (Math.abs(debtor.net) < 0.01) i++;
    if (Math.abs(creditor.net) < 0.01) j++;
  }

  return transfers;
}

// Sección "gastos en reunión" (RF-15): división rápida de una cuenta puntual entre N presentes.
export function splitMeetingExpense(totalAmount: number, peopleCount: number): number {
  if (peopleCount <= 0) return 0;
  return Number((totalAmount / peopleCount).toFixed(2));
}
