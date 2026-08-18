import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabsParamList } from "./types";
import { HomeScreen } from "@/screens/home/HomeScreen";
import { ShoppingListScreen } from "@/screens/session/ShoppingListScreen";
import { BudgetScreen } from "@/screens/budget/BudgetScreen";
import { ResultScreen } from "@/screens/result/ResultScreen";
import { MeetingExpensesScreen } from "@/screens/meeting/MeetingExpensesScreen";

// Navegación principal por pestañas, una vez el usuario está identificado en una sesión.
// Cubre RF-04 (home), RF-05..RF-12 (lista), RF-13 (presupuesto), RF-14/RF-16 (resultado), RF-15 (reunión).
const Tab = createBottomTabNavigator<TabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="ShoppingList" component={ShoppingListScreen} options={{ title: "Lista" }} />
      <Tab.Screen name="Budget" component={BudgetScreen} options={{ title: "Presupuesto" }} />
      <Tab.Screen name="Result" component={ResultScreen} options={{ title: "Resultado" }} />
      <Tab.Screen name="Meeting" component={MeetingExpensesScreen} options={{ title: "En la reunión" }} />
    </Tab.Navigator>
  );
}
