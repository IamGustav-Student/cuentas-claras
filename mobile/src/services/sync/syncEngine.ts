import { getDb } from "@/database";
import { httpClient } from "@/services/api/httpClient";

// Motor de sincronización offline-first.
// Por qué existe: SQLite es local a cada dispositivo, así que para que dos usuarios vean el mismo
// estado de la sesión necesitamos un backend central (ver docs/04-arquitectura.md, sección
// "Por qué no alcanza con SQLite local"). Este módulo:
// 1) Encola en `pending_sync` cualquier escritura hecha sin conexión.
// 2) Cuando hay red, reenvía la cola al backend en orden y limpia lo confirmado.
// 3) El backend sigue siendo la fuente de verdad para resolver conflictos de reserva (RF-08).

export async function enqueuePendingChange(entity: string, entityId: string, operation: string, payload: unknown) {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO pending_sync (id, entity, entity_id, operation, payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      `${entity}-${entityId}-${Date.now()}`,
      entity,
      entityId,
      operation,
      JSON.stringify(payload),
      new Date().toISOString(),
    ],
  );
}

export async function flushPendingChanges(): Promise<void> {
  const db = getDb();
  const pending = await db.getAllAsync<any>("SELECT * FROM pending_sync ORDER BY created_at ASC");

  for (const row of pending) {
    try {
      const payload = JSON.parse(row.payload);
      await httpClient.post(`/sync/${row.entity}`, { operation: row.operation, entityId: row.entity_id, payload });
      await db.runAsync("DELETE FROM pending_sync WHERE id = ?", [row.id]);
    } catch (err) {
      // Se detiene ante el primer error de red: se reintentará en el próximo flush.
      break;
    }
  }
}
