import type { TaxRegime } from "./types";

/**
 * IRT, Grupo A (trabalho por conta de outrem), em vigor em 2026.
 * Fórmula: IRT = parcela fixa + (matéria colectável − excesso) × taxa.
 *
 * Convenção adotada: o limite superior de cada escalão é inclusive
 * (ex.: 150.000 Kz fica no 1.º escalão; 150.001 Kz no 2.º).
 */
export const IRT_GRUPO_A_2026: TaxRegime = {
  id: "irt-grupo-a-2026",
  name: "IRT, Grupo A (2026)",
  validFrom: "2026-01-01",
  validTo: null,
  legalBasis:
    "Lei n.º 18/14, com as alterações da Lei n.º 28/20 e da Lei n.º 14/25, de 30 de Dezembro (OGE 2026)",
  sources: [
    "https://angolex.com/paginas/outros/calculadora-do-irt-angola-grupo-a-2026a.html",
    "https://reclameaqui.ao/blog/tabela-irt-angola-2026",
  ],
  socialSecurityEmployeeRate: 0.03,
  brackets: [
    { upTo: 150_000, fixedAmount: 0, rate: 0, excessOver: 0 },
    { upTo: 200_000, fixedAmount: 12_500, rate: 0.16, excessOver: 150_000 },
    { upTo: 300_000, fixedAmount: 31_250, rate: 0.18, excessOver: 200_000 },
    { upTo: 500_000, fixedAmount: 49_250, rate: 0.19, excessOver: 300_000 },
    { upTo: 1_000_000, fixedAmount: 87_250, rate: 0.2, excessOver: 500_000 },
    { upTo: 1_500_000, fixedAmount: 187_250, rate: 0.21, excessOver: 1_000_000 },
    { upTo: 2_000_000, fixedAmount: 292_250, rate: 0.22, excessOver: 1_500_000 },
    { upTo: 2_500_000, fixedAmount: 402_250, rate: 0.23, excessOver: 2_000_000 },
    { upTo: 5_000_000, fixedAmount: 517_250, rate: 0.24, excessOver: 2_500_000 },
    { upTo: 10_000_000, fixedAmount: 1_117_250, rate: 0.245, excessOver: 5_000_000 },
    { upTo: null, fixedAmount: 2_342_250, rate: 0.25, excessOver: 10_000_000 },
  ],
};