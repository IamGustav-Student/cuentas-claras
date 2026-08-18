import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { ItemStatusBadge } from "./ItemStatusBadge";
import { ShoppingItem } from "@/domain/models";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

interface Props {
  item: ShoppingItem;
  onPress: () => void;
}

// RF-09/RF-10: fila de la lista dinámica de ítems, con su estado y observación (ej: "reservado por Pedro").
export function ItemRow({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyBold">{item.name}</AppText>
        {item.observation ? (
          <AppText variant="caption" style={{ color: colors.textMuted }}>
            {item.observation}
          </AppText>
        ) : null}
      </View>
      <ItemStatusBadge status={item.status} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
});
