export function formatCents(amountCents: number, currency: string = "USD") {
  const dollars = amountCents / 100;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(dollars);
}