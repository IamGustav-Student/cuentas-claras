import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { AppTextInput } from "@/components/common/AppTextInput";
import { AppButton } from "@/components/common/AppButton";
import { spacing } from "@/theme/spacing";
import { splitMeetingExpense } from "@/domain/balanceCalculator";
import { formatCurrency } from "@/utils/formatters";

// RF-15: "gastos en reunión" — división rápida de una cuenta puntual (ej: restaurante), sin
// necesidad de crear una sesión completa.
export function MeetingExpensesScreen() {
  const [total, setTotal] = useState("");
  const [people, setPeople] = useState("");
  const [result, setResult] = useState<number | null>(null);

  function handleCalculate() {
    const totalAmount = Number(total.replace(",", "."));
    const peopleCount = Number(people);
    if (Number.isNaN(totalAmount) || Number.isNaN(peopleCount)) return;
    setResult(splitMeetingExpense(totalAmount, peopleCount));
  }

  return (
    <View style={styles.container}>
      <AppText variant="h2">Gastos en reunión</AppText>
      <AppText variant="caption" style={{ marginBottom: spacing.md }}>
        Ideal para dividir la cuenta de un restaurante al instante.
      </AppText>
      <AppTextInput placeholder="Total de la cuenta" keyboardType="numeric" value={total} onChangeText={setTotal} style={{ marginBottom: spacing.sm }} />
      <AppTextInput placeholder="Cantidad de personas" keyboardType="numeric" value={people} onChangeText={setPeople} style={{ marginBottom: spacing.md }} />
      <AppButton label="Calcular" onPress={handleCalculate} />
      {result !== null && (
        <AppText variant="h1" style={{ marginTop: spacing.lg, textAlign: "center" }}>
          {formatCurrency(result)} c/u
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
});
