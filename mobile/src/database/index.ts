import * as SQLite from "expo-sqlite";
import { CREATE_TABLES_SQL } from "./schema";

// Base de datos local SQLite del dispositivo. Actúa como cache offline-first:
// - Lecturas de UI siempre van primero contra SQLite local (rápidas, funcionan sin red).
// - Las escrituras se guardan localmente y se sincronizan contra el backend (ver services/sync/syncEngine.ts).
let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error("La base de datos no fue inicializada. Llamá a initDatabase() en el arranque de la app.");
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync("cuentasclaras.db");
  await db.execAsync(CREATE_TABLES_SQL);
}
