const NBSP = "\u00A0";

function groupThousands(integer: string, separator: string): string {
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/** 1234.5 → "1 234,50 Kz" (formato fixo, igual no servidor e no navegador). */
export function formatKz(value: number): string {
  const [integer, decimals] = value.toFixed(2).split(".");
  return `${groupThousands(integer, NBSP)},${decimals}${NBSP}Kz`;
}

/** 0.168 → "16,8 %" */
export function formatPercent(fraction: number): string {
  return `${(fraction * 100).toFixed(1).replace(".", ",")}${NBSP}%`;
}

/**
 * Converte o que a pessoa escreveu em número.
 * Pontos e espaços contam como separadores de milhares; a vírgula é decimal.
 * Ex.: "350 000" → 350000 · "1.250.000,50" → 1250000.5
 */
export function parseAmount(text: string): number {
  const cleaned = text.replace(/[^\d,]/g, "").replace(",", ".");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}

/** Arruma o texto do campo depois de escrever: 350000 → "350 000". */
export function formatAmountInput(value: number): string {
  if (value === 0) return "";
  const [integer, decimals] = value.toFixed(2).split(".");
  const grouped = groupThousands(integer, " ");
  return decimals === "00" ? grouped : `${grouped},${decimals}`;
}