import * as Crypto from "expo-crypto";

// IDs únicos generados en el cliente (útil en modo offline, ver docs/04-arquitectura.md).
export async function generateId(): Promise<string> {
  return Crypto.randomUUID();
}
