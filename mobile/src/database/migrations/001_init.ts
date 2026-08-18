// Punto de partida para futuras migraciones de esquema local.
// Convención: cada archivo numerado representa un cambio incremental sobre schema.ts.
// Para un proyecto académico de este tamaño alcanza con re-ejecutar CREATE_TABLES_SQL (idempotente,
// usa IF NOT EXISTS). Si el modelo crece, agregar aquí ALTER TABLE versionados y un registro
// de versión en una tabla `schema_meta`.

export const MIGRATION_001 = {
  version: 1,
  description: "Esquema inicial: sessions, participants, items, budget_contributions, pending_sync",
};
