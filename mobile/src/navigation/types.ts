// Tipado de rutas de navegación. Mantiene la app type-safe (buena práctica RN + TS).
export type RootStackParamList = {
  JoinSession: { sessionId?: string; token?: string } | undefined;
  EnterName: { sessionId: string };
  Tabs: undefined;
  ItemDetail: { itemId: string };
  NewSession: undefined;
};

export type TabsParamList = {
  Home: undefined;
  ShoppingList: undefined;
  Budget: undefined;
  Result: undefined;
  Meeting: undefined;
};
