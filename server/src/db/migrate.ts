import "./connection";

// Ejecutar con `npm run migrate`. Al importar "./connection" ya se aplica schema.sql
// (CREATE TABLE IF NOT EXISTS es idempotente). Si el proyecto crece, reemplazar esto
// por una librería de migraciones versionadas (ej. umzug, knex migrations).
console.log("Esquema aplicado correctamente sobre", process.env.DB_FILE ?? "./data/cuentasclaras.db");
