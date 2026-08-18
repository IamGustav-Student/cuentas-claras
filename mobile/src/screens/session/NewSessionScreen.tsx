import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppText } from "@/components/common/AppText";
import { AppTextInput } from "@/components/common/AppTextInput";
import { AppButton } from "@/components/common/AppButton";
import { spacing } from "@/theme/spacing";
import { sessionApi } from "@/services/api/sessionApi";
import { useUserStore } from "@/store/userStore";
import { useNavigation } from "@react-navigation/native";
import { shareSessionLinkViaWhatsApp } from "@/services/whatsapp/shareLink";

// RF-03 / CU (Anfitrión): crear sesión y cargar la lista de compras sugerida.
export function NewSessionScreen() {
  const navigation = useNavigation<any>();
  const setUser = useUserStore((s) => s.setUser);
  const [sessionName, setSessionName] = useState("");
  const [hostName, setHostName] = useState("");
  const [itemsText, setItemsText] = useState("");

  async function handleCreate() {
    const items = itemsText
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);

    const { data: session } = await sessionApi.create({ name: sessionName, hostName, items });
    setUser(session.id, hostName, true);

    const shareUrl = `cuentasclaras://join?token=${session.shareToken}`;
    await shareSessionLinkViaWhatsApp(shareUrl, session.name);

    navigation.replace("Tabs");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText variant="h2">Nueva sesión</AppText>
      <AppTextInput placeholder="Nombre de la sesión (ej: Asado del sábado)" value={sessionName} onChangeText={setSessionName} style={styles.input} />
      <AppTextInput placeholder="Tu nombre (anfitrión)" value={hostName} onChangeText={setHostName} style={styles.input} />
      <AppText variant="caption" style={{ marginTop: spacing.md }}>
        Lista de compras sugerida (un ítem por línea)
      </AppText>
      <AppTextInput
        placeholder={"Carbón\nCarne\nHielo"}
        value={itemsText}
        onChangeText={setItemsText}
        multiline
        style={[styles.input, { height: 120, textAlignVertical: "top" }]}
      />
      <View style={{ marginTop: spacing.lg }}>
        <AppButton label="Crear e invitar por WhatsApp" onPress={handleCreate} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  input: { marginTop: spacing.sm },
});
