import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { AppText } from "@/components/common/AppText";
import { AppButton } from "@/components/common/AppButton";
import { spacing } from "@/theme/spacing";
import { sessionApi } from "@/services/api/sessionApi";

type Props = NativeStackScreenProps<RootStackParamList, "JoinSession">;

// CU-01: punto de entrada. Landing "Mobile First" (EDT 1.2.1.1) adaptada a pantalla nativa.
// El link de WhatsApp abre la app vía deep link (ver app.json -> scheme, y route params: token).
export function JoinSessionScreen({ route, navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const token = route.params?.token;

  useEffect(() => {
    if (token) handleJoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleJoin() {
    if (!token) return;
    setLoading(true);
    try {
      const { data: session } = await sessionApi.getByToken(token);
      navigation.replace("EnterName", { sessionId: session.id });
    } catch (e) {
      // A1 (CU-01): link inválido o sesión cerrada/vencida.
      // TODO: mostrar mensaje de error claro (RNF-04).
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AppText variant="h1">CuentasClaras</AppText>
      <AppText variant="body" style={{ marginVertical: spacing.md, textAlign: "center" }}>
        Organizá compras grupales, evitá duplicados y dividí los gastos sin vueltas.
      </AppText>
      {token ? (
        <AppText variant="caption">Uniéndote a la sesión...</AppText>
      ) : (
        <AppButton label="Crear nueva sesión" onPress={() => navigation.navigate("NewSession")} disabled={loading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
});
