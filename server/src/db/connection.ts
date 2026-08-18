import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "../config/env";

// Conexión única a la base SQLite del servidor (fuente de verdad para todos los clientes).
fs.mkdirSync(path.dirname(config.dbFile), { recursive: true });

export const db = new Database(config.dbFile);
db.pragma("journal_mode = WAL"); // mejor concurrencia de lecturas/escrituras, clave para RF-08.

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
db.exec(schema);
