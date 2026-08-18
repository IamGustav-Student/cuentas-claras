import { Text, TextProps } from "react-native";
import { typography } from "@/theme/typography";
import { colors } from "@/theme/colors";

type Variant = keyof typeof typography;

// RNF-04: centraliza tamaños de letra grandes/legibles en un solo lugar.
export function AppText({ variant = "body", style, ...rest }: TextProps & { variant?: Variant }) {
  return <Text style={[typography[variant], { color: colors.text }, style]} {...rest} />;
}
