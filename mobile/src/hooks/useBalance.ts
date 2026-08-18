import { useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { calculateBalance, simplifySettlement } from "@/domain/balanceCalculator";
import { BudgetContribution } from "@/domain/models";

// CU-04/CU-04a: expone el balance ya calculado a la pantalla de Resultado.
export function useBalance(contributions: BudgetContribution[]) {
  const participants = useSessionStore((s) => s.participants);
  const items = useSessionStore((s) => s.items);

  const balances = useMemo(
    () => calculateBalance(participants, items, contributions),
    [participants, items, contributions],
  );

  const transfers = useMemo(() => simplifySettlement(balances), [balances]);

  return { balances, transfers };
}
