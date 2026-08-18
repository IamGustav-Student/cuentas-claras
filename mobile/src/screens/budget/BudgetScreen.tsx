import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { AppTextInput } from "@/components/common/AppTextInput";
import { AppButton } from "@/components/common/AppButton";
import { ContributorRow } from "@/components/budget/ContributorRow";
import { spacing } from "@/theme/spacing";
import { useSessionStore } from "@/store/sessionStore";
import { useUserStore } from "@/store/userStore";
import { budgetApi } from "@/services/api/budgetApi";
import { BudgetContribution } from "@/domain/models";
import { isValidPrice } from "@/utils/validators";

// RF-13: sección "Presupuesto", explícitamente opcional.
export function BudgetScreen() {
  const sessionId = useSessionStore((s) => s.session?.id ?? "");
  const participantId = useUserStore((s) => s.participantId);
  const [amount, setAmount] = useState("");
  const [contributions, setContributions] = useState<BudgetContribution[]>([]);

  async function handleAdd() {
    if (!isValidPrice(amount) || !participantId) return;
    await budgetApi.contribute(sessionId, { participantId, amount: Number(amount.replace(",", ".")) });
    setAmount("");
    // TODO: refrescar desde el backend / SQLite local tras confirmar el aporte.
  }

  return (
    <View style={styles.container}>
      <AppText variant="body" style={{ marginBottom: spacing.md }}>
        Esta sección es opcional: se puede usar o no (RF-13).
      </AppText>
      <AppTextInput placeholder="Monto que aportás" keyboardType="numeric" value={amount} onChangeText={setAmount} />
      <View style={{ marginVertical: spacing.md }}>
        <AppButton label="Registrar aporte" onPress={handleAdd} />
      </View>
      <FlatList
        data={contributions}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <ContributorRow name={item.participantId} amount={item.amount} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
});
