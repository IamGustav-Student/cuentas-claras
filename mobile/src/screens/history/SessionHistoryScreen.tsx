import { FlatList, StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { spacing } from "@/theme/spacing";
import { useEffect, useState } from "react";
import { sessionRepository } from "@/database/repositories/sessionRepository";
import { Session } from "@/domain/models";
import { formatDateTime } from "@/utils/formatters";

// RF-04 (parte "consulta de sesiones anteriores"). Se mantiene como pantalla independiente
// por si se quiere acceder al historial completo fuera del Home.
export function SessionHistoryScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    sessionRepository.listAll().then(setSessions);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <AppText variant="bodyBold">{item.name}</AppText>
            <AppText variant="caption">{formatDateTime(item.createdAt)}</AppText>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  row: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: "#eee" },
});
