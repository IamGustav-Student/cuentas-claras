import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { AppText } from "@/components/common/AppText";
import { AppTextInput } from "@/components/common/AppTextInput";
import { AppButton } from "@/components/common/AppButton";
import { spacing } from "@/theme/spacing";
import { isNonEmptyName } from "@/utils/validators";
import { useUserStore } from "@/store/userStore";
import { generateId } from "@/utils/idGenerator";
import { userRepository } from "@/database/repositories/userRepository";

type Props = NativeStackScreenProps<RootStackParamList, "EnterName">;

// CU-01, pasos 3-5 / RF-02: al entrar por el link solo se pide el nombre.
export function EnterNameScreen({ route, navigation }: Props) {
  const { sessionId } = route.params;
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const setUser = useUserStore((s) => s.setUser);

  async function handleContinue() {
    if (!isNonEmptyName(name)) {
      // A2 (CU-01): el sistema vuelve a pedir el nombre.
      setError(true);
      return;
    }
    const id = await generateId();
    await userRepository.upsert({ id, sessionId, name: name.trim(), isHost: false, joinedAt: new Date().toISOString() });
    setUser(id, name.trim(), false);
    navigation.replace("Tabs");
  }

  return (
    <View style={styles.container}>
      <AppText variant="h2">¿Cómo te llamás?</AppText>
      <AppTextInput
        placeholder="Tu nombre"
        value={name}
        onChangeText={(t) => {
          setName(t);
          setError(false);
        }}
        style={{ marginVertical: spacing.md, width: "100%" }}
        autoFocus
      />
      {error ? (
        <AppText variant="caption" style={{ color: "red", marginBottom: spacing.sm }}>
          Ingresá tu nombre para continuar.
        </AppText>
      ) : null}
      <AppButton label="Continuar" onPress={handleContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
});
