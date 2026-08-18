import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { formatCurrency } from "@/utils/formatters";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { BalanceEntry } from "@/domain/models";

// CU-04: muestra cuánto aportó, gastó y debe recibir/pagar cada participante.
export function BalanceCard({ entry }: { entry: BalanceEntry }) {
  const owes = entry.net < 0;
  return (
    <View style={styles.card}>
      <AppText variant="bodyBold">{entry.participantName}</AppText>
      <AppText variant="caption" style={{ color: colors.textMuted }}>
        Aportó {formatCurrency(entry.contributed)} · Gastó {formatCurrency(entry.spent)}
      </AppText>
      <AppText variant="h2" style={{ color: owes ? colors.danger : colors.success, marginTop: spacing.xs }}>
        {owes ? `Debe pagar ${formatCurrency(Math.abs(entry.net))}` : `Debe recibir ${formatCurrency(entry.net)}`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
});
