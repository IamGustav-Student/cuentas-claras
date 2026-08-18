import { FlatList, StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { AppButton } from "@/components/common/AppButton";
import { BalanceCard } from "@/components/result/BalanceCard";
import { spacing } from "@/theme/spacing";
import { useBalance } from "@/hooks/useBalance";
import { shareResultSummary } from "@/services/whatsapp/shareLink";
import { formatCurrency } from "@/utils/formatters";

// CU-04/CU-04a + RF-14/RF-16: balance final y opción de compartirlo.
export function ResultScreen() {
  // TODO: reemplazar [] por las contribuciones reales de la sesión (ver budgetRepository).
  const { balances, transfers } = useBalance([]);

  function handleShare() {
    const summary = transfers
      .map((t) => `${t.fromParticipantId} le debe ${formatCurrency(t.amount)} a ${t.toParticipantId}`)
      .join("\n");
    shareResultSummary(summary || "Todos están a mano.");
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={balances}
        keyExtractor={(b) => b.participantId}
        renderItem={({ item }) => <BalanceCard entry={item} />}
        ListHeaderComponent={<AppText variant="h2" style={{ marginBottom: spacing.md }}>Resultado</AppText>}
      />
      <AppButton label="Compartir resultado" onPress={handleShare} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
});
