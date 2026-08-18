import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { formatCurrency } from "@/utils/formatters";
import { spacing } from "@/theme/spacing";

// RF-13: fila de aportante dentro de la sección Presupuesto (opcional).
export function ContributorRow({ name, amount }: { name: string; amount: number }) {
  return (
    <View style={styles.row}>
      <AppText variant="body">{name}</AppText>
      <AppText variant="bodyBold">{formatCurrency(amount)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm },
});
