import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

// Input grande y de alto contraste, en línea con RNF-04.
export function AppTextInput(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.textMuted} style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.body.fontSize,
    backgroundColor: colors.surface,
  },
});
