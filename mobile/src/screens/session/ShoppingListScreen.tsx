import { FlatList, StyleSheet, View } from "react-native";
import { useSessionStore } from "@/store/sessionStore";
import { ItemRow } from "@/components/list/ItemRow";
import { ReservationConflictModal } from "@/components/list/ReservationConflictModal";
import { useShoppingList } from "@/hooks/useShoppingList";
import { useReservation } from "@/hooks/useReservation";
import { useNavigation } from "@react-navigation/native";
import { spacing } from "@/theme/spacing";

// RF-05..RF-11 / CU-02 / CU-02a: pantalla principal de la sesión de compra.
export function ShoppingListScreen() {
  const navigation = useNavigation<any>();
  const sessionId = useSessionStore((s) => s.session?.id ?? "");
  const { items } = useShoppingList(sessionId);
  const { conflict, resolveConflict } = useReservation();

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ItemRow item={item} onPress={() => navigation.navigate("ItemDetail", { itemId: item.id })} />
        )}
      />
      <ReservationConflictModal
        visible={!!conflict}
        competingParticipantName={conflict?.competingParticipantName ?? ""}
        onInsist={() => resolveConflict(true)}
        onCede={() => resolveConflict(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: spacing.sm },
});
