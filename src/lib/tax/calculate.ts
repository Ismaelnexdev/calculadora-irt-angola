import { IRT_GRUPO_A_2026 } from "./tables";
import type { TaxBracket, TaxRegime } from "./types";

/** Sobre que valor incide a contribuição para a Segurança Social. */
export type SocialSecurityBase = "base" | "base-and-allowances";

export interface SalaryInput {
  /** Salário base mensal, em Kz. */
  baseSalary: number;
  /** Subsídios sujeitos a IRT (ex.: parte que excede o limite de isenção). */
  taxableAllowances?: number;
  /** Subsídios isentos de IRT. */
  exemptAllowances?: number;
  /** Por defeito: apenas o salário base. */
  socialSecurityBase?: SocialSecurityBase;
  /** Por defeito: IRT, Grupo A, 2026. */
  regime?: TaxRegime;
}

export interface IrtResult {
  irt: number;
  bracketIndex: number;
  bracket: TaxBracket;
}

export interface SalaryResult extends IrtResult {
  /** Tudo o que o trabalhador recebe antes de descontos. */
  grossIncome: number;
  socialSecurity: number;
  /** Matéria colectável (rendimento sujeito a IRT, já sem Segurança Social). */
  taxableIncome: number;
  netSalary: number;
  /** IRT a dividir pelo rendimento bruto, em fração. */
  effectiveRate: number;
  regimeId: string;
}

const round2 = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

function assertValidAmount(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} deve ser um número maior ou igual a zero.`);
  }
}

/** Calcula o IRT a partir da matéria colectável, usando um regime. */
export function calculateIrt(
  taxableIncome: number,
  regime: TaxRegime = IRT_GRUPO_A_2026,
): IrtResult {
  assertValidAmount("A matéria colectável", taxableIncome);

  const bracketIndex = regime.brackets.findIndex(
    (b) => b.upTo === null || taxableIncome <= b.upTo,
  );
  const bracket = regime.brackets[bracketIndex];
  const irt =
    bracket.fixedAmount + (taxableIncome - bracket.excessOver) * bracket.rate;

  return { irt: round2(Math.max(irt, 0)), bracketIndex, bracket };
}

/** Do salário bruto ao salário líquido, passo a passo. */
export function calculateSalary(input: SalaryInput): SalaryResult {
  const {
    baseSalary,
    taxableAllowances = 0,
    exemptAllowances = 0,
    socialSecurityBase = "base",
    regime = IRT_GRUPO_A_2026,
  } = input;

  assertValidAmount("O salário base", baseSalary);
  assertValidAmount("Os subsídios sujeitos a IRT", taxableAllowances);
  assertValidAmount("Os subsídios isentos", exemptAllowances);

  const grossIncome = baseSalary + taxableAllowances + exemptAllowances;

  const socialSecurityAmount =
    socialSecurityBase === "base"
      ? baseSalary
      : baseSalary + taxableAllowances;
  const socialSecurity = round2(
    socialSecurityAmount * regime.socialSecurityEmployeeRate,
  );

  const taxableIncome = round2(
    Math.max(baseSalary + taxableAllowances - socialSecurity, 0),
  );

  const { irt, bracketIndex, bracket } = calculateIrt(taxableIncome, regime);

  const netSalary = round2(grossIncome - socialSecurity - irt);
  const effectiveRate = grossIncome > 0 ? irt / grossIncome : 0;

  return {
    grossIncome: round2(grossIncome),
    socialSecurity,
    taxableIncome,
    irt,
    bracketIndex,
    bracket,
    netSalary,
    effectiveRate,
    regimeId: regime.id,
  };
}