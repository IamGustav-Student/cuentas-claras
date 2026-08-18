export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-AR");
}
