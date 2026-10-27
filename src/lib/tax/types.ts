/** Um escalão da tabela de retenção do IRT. Valores em kwanzas (Kz). */
export interface TaxBracket {
  /** Limite superior do escalão (inclusive). `null` no último escalão. */
  upTo: number | null;
  /** Parcela fixa, em Kz. */
  fixedAmount: number;
  /** Taxa do escalão, em fração (0.16 = 16%). */
  rate: number;
  /** Valor a partir do qual a taxa incide (o "excesso"), em Kz. */
  excessOver: number;
}

/** Conjunto de regras fiscais, com data de vigência. */
export interface TaxRegime {
  id: string;
  name: string;
  /** Início de vigência (ISO 8601). */
  validFrom: string;
  /** Fim de vigência (ISO 8601), ou `null` se ainda estiver em vigor. */
  validTo: string | null;
  legalBasis: string;
  sources: string[];
  /** Contribuição do trabalhador para a Segurança Social, em fração. */
  socialSecurityEmployeeRate: number;
  brackets: TaxBracket[];
}