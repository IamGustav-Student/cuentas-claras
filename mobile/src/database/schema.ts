// Esquema SQLite local (cache offline-first del dispositivo).
// Espeja el esquema del servidor (ver server/src/db/schema.sql y docs/05-modelo-de-datos.md)
// para poder mostrar datos aun sin conexión y encolar cambios pendientes de sincronizar.

export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  host_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  closed_at TEXT,
  share_token TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  name TEXT NOT NULL,
  is_host INTEGER NOT NULL DEFAULT 0,
  joined_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente',
  reserved_by TEXT REFERENCES participants(id),
  observation TEXT,
  price_paid REAL,
  ticket_image_uri TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS budget_contributions (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  participant_id TEXT NOT NULL REFERENCES participants(id),
  amount REAL NOT NULL,
  created_at TEXT NOT NULL
);

-- Cola de cambios pendientes de sincronizar con el backend (soporte offline-first).
CREATE TABLE IF NOT EXISTS pending_sync (
  id TEXT PRIMARY KEY NOT NULL,
  entity TEXT NOT NULL,       -- 'item' | 'budget_contribution' | 'participant'
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL,    -- 'create' | 'update'
  payload TEXT NOT NULL,      -- JSON serializado
  created_at TEXT NOT NULL
);
`;
