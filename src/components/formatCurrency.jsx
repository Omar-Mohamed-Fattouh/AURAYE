// src/components/formatCurrency.js
export function formatEGP(value = 0) {
  const n = Number(value || 0);
  return `EGP ${n.toFixed(2)}`;
}
