import { Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

// Botón único reutilizado en toda la app: mantiene consistencia visual (buena práctica de UI kit propio).
export function AppButton({ label, onPress, variant = "primary", disabled }: Props) {
  const bg =
    variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : colors.secondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}
    >
      <AppText variant="button" style={{ color: "#fff" }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52, // touch target grande, apto para uso "en movimiento" (RNF-04)
  },
});
