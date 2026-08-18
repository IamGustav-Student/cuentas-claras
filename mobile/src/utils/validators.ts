// Validaciones reutilizadas por formularios (CU-01 A2, CU-03 A2, etc.)
export function isNonEmptyName(value: string): boolean {
  return value.trim().length >= 2;
}

export function isValidPrice(value: string): boolean {
  const n = Number(value.replace(",", "."));
  return !Number.isNaN(n) && n > 0;
}
