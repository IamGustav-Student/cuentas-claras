import Constants from "expo-constants";

// Lee la config de app.json -> extra (o variables de entorno en builds EAS).
// Ver docs/09-despliegue.md para cómo se setea en cada ambiente.
const extra = Constants.expoConfig?.extra ?? {};

export const env = {
  apiUrl: (extra.apiUrl as string) ?? "http://localhost:3000",
  socketUrl: (extra.socketUrl as string) ?? "http://localhost:3000",
};
