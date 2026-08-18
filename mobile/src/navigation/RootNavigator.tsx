import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { JoinSessionScreen } from "@/screens/access/JoinSessionScreen";
import { EnterNameScreen } from "@/screens/access/EnterNameScreen";
import { AppTabs } from "./AppTabs";
import { ItemDetailScreen } from "@/screens/session/ItemDetailScreen";
import { NewSessionScreen } from "@/screens/session/NewSessionScreen";

// Pila raíz: acceso vía link de WhatsApp (CU-01) -> tabs de la sesión activa.
const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="JoinSession">
      <Stack.Screen name="JoinSession" component={JoinSessionScreen} options={{ title: "CuentasClaras" }} />
      <Stack.Screen name="EnterName" component={EnterNameScreen} options={{ title: "¿Cómo te llamás?" }} />
      <Stack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ title: "Ítem" }} />
      <Stack.Screen name="NewSession" component={NewSessionScreen} options={{ title: "Nueva sesión" }} />
    </Stack.Navigator>
  );
}
