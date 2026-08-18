import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { colors } from "@/theme/colors";
import { ItemStatus } from "@/domain/models";

// RF-09: estado del ítem (pendiente | comprado), siempre visible con alto contraste.
export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  const isPurchased = status === "comprado";
  return (
    <View style={[styles.badge, { backgroundColor: isPurchased ? colors.success : colors.warning }]}>
      <AppText variant="caption" style={{ color: "#fff" }}>
        {isPurchased ? "Comprado" : "Pendiente"}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
});
