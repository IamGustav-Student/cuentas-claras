import { FlatList, StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { AppButton } from "@/components/common/AppButton";
import { spacing } from "@/theme/spacing";
import { useEffect, useState } from "react";
import { sessionRepository } from "@/database/repositories/sessionRepository";
import { Session } from "@/domain/models";
import { useNavigation } from "@react-navigation/native";
import { formatDateTime } from "@/utils/formatters";

// RF-04: Home con selector de "Nueva sesión" e historial de sesiones anteriores.
export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [history, setHistory] = useState<Session[]>([]);

  useEffect(() => {
    sessionRepository.listAll().then(setHistory);
  }, []);

  return (
    <View style={styles.container}>
      <AppButton label="Nueva sesión de compra" onPress={() => navigation.navigate("NewSession")} />
      <AppText variant="h2" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        Sesiones anteriores
      </AppText>
      <FlatList
        data={history}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <View style={styles.historyRow}>
            <AppText variant="body">{item.name}</AppText>
            <AppText variant="caption">{formatDateTime(item.createdAt)}</AppText>
          </View>
        )}
        ListEmptyComponent={<AppText variant="caption">Todavía no participaste de ninguna sesión.</AppText>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  historyRow: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: "#eee" },
});
