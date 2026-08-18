import { Modal, StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { AppButton } from "@/components/common/AppButton";
import { spacing } from "@/theme/spacing";

interface Props {
  visible: boolean;
  competingParticipantName: string;
  onInsist: () => void;
  onCede: () => void;
}

// CU-02a / RF-08: ventana de aviso cuando dos usuarios intentan reservar el mismo ítem a la vez.
// Debe aparecer en <1s y ser clara sin ambigüedad (criterio de aceptación del EDT 1.1.3.2/1.2.2.4).
export function ReservationConflictModal({ visible, competingParticipantName, onInsist, onCede }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <AppText variant="h2">¡Alguien más lo quiere!</AppText>
          <AppText variant="body" style={{ marginVertical: spacing.md }}>
            {competingParticipantName} también está intentando reservar este ítem. ¿Querés insistir con tu
            reserva?
          </AppText>
          <View style={{ gap: spacing.sm }}>
            <AppButton label="Sí, insistir" onPress={onInsist} />
            <AppButton label="No, cederlo" variant="secondary" onPress={onCede} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: spacing.lg, width: "85%" },
});
