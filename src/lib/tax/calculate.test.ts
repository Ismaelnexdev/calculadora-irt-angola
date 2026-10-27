import { describe, expect, it } from "vitest";
import { calculateIrt, calculateSalary } from "./calculate";
import type { TaxRegime } from "./types";

describe("calculateIrt (matéria colectável → IRT)", () => {
  it("não cobra imposto até ao limite de isenção (150.000 Kz)", () => {
    expect(calculateIrt(0).irt).toBe(0);
    expect(calculateIrt(150_000).irt).toBe(0);
    expect(calculateIrt(150_000).bracketIndex).toBe(0);
  });

  it("bate certo com o exemplo divulgado pela AGT (175.000 Kz → 16.500 Kz)", () => {
    const result = calculateIrt(175_000);
    expect(result.irt).toBeCloseTo(16_500, 2);
    expect(result.bracketIndex).toBe(1);
  });

  it("trata o limite superior de cada escalão como inclusivo", () => {
    expect(calculateIrt(200_000).bracketIndex).toBe(1);
    expect(calculateIrt(200_001).bracketIndex).toBe(2);
    expect(calculateIrt(500_000).bracketIndex).toBe(3);
    expect(calculateIrt(500_001).bracketIndex).toBe(4);
  });

  it("calcula corretamente dentro de escalões intermédios", () => {
    expect(calculateIrt(200_000).irt).toBeCloseTo(20_500, 2);
    expect(calculateIrt(350_000).irt).toBeCloseTo(58_750, 2);
    expect(calculateIrt(500_000).irt).toBeCloseTo(87_250, 2);
  });

  it("aplica o último escalão (acima de 10.000.000 Kz)", () => {
    const result = calculateIrt(12_000_000);
    expect(result.bracketIndex).toBe(10);
    expect(result.irt).toBeCloseTo(2_842_250, 2);
  });

  it("documenta o salto da tabela no limite de isenção", () => {
    // Comportamento da tabela tal como publicada: 150.000 Kz → 0 Kz,
    // mas 150.001 Kz → ~12.500 Kz (a parcela fixa do 2.º escalão arranca logo).
    expect(calculateIrt(150_000).irt).toBe(0);
    expect(calculateIrt(150_001).irt).toBeCloseTo(12_500.16, 2);
  });

  it("rejeita valores inválidos", () => {
    expect(() => calculateIrt(-1)).toThrow(RangeError);
    expect(() => calculateIrt(Number.NaN)).toThrow(RangeError);
    expect(() => calculateIrt(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe("calculateSalary (salário bruto → líquido)", () => {
  it("calcula um salário de 500.000 Kz, passo a passo", () => {
    const r = calculateSalary({ baseSalary: 500_000 });
    expect(r.grossIncome).toBe(500_000);
    expect(r.socialSecurity).toBeCloseTo(15_000, 2);
    expect(r.taxableIncome).toBeCloseTo(485_000, 2);
    expect(r.irt).toBeCloseTo(84_400, 2);
    expect(r.netSalary).toBeCloseTo(400_600, 2);
    expect(r.effectiveRate).toBeCloseTo(0.1688, 4);
    expect(r.regimeId).toBe("irt-grupo-a-2026");
  });

  it("não cobra IRT a um salário de 150.000 Kz, mas cobra Segurança Social", () => {
    const r = calculateSalary({ baseSalary: 150_000 });
    expect(r.socialSecurity).toBeCloseTo(4_500, 2);
    expect(r.irt).toBe(0);
    expect(r.netSalary).toBeCloseTo(145_500, 2);
  });

  it("com subsídios: Segurança Social só sobre o salário base (regra por defeito)", () => {
    const r = calculateSalary({
      baseSalary: 300_000,
      taxableAllowances: 50_000,
      exemptAllowances: 30_000,
    });
    expect(r.grossIncome).toBe(380_000);
    expect(r.socialSecurity).toBeCloseTo(9_000, 2);
    expect(r.taxableIncome).toBeCloseTo(341_000, 2);
    expect(r.irt).toBeCloseTo(57_040, 2);
    expect(r.netSalary).toBeCloseTo(313_960, 2);
  });

  it("com subsídios: Segurança Social sobre base + subsídios sujeitos", () => {
    const r = calculateSalary({
      baseSalary: 300_000,
      taxableAllowances: 50_000,
      exemptAllowances: 30_000,
      socialSecurityBase: "base-and-allowances",
    });
    expect(r.socialSecurity).toBeCloseTo(10_500, 2);
    expect(r.taxableIncome).toBeCloseTo(339_500, 2);
    expect(r.irt).toBeCloseTo(56_755, 2);
    expect(r.netSalary).toBeCloseTo(312_745, 2);
  });

  it("mantém sempre: líquido = bruto − Segurança Social − IRT", () => {
    for (const baseSalary of [0, 100_000, 150_000, 175_000, 300_000, 1_000_000, 12_000_000]) {
      const r = calculateSalary({ baseSalary });
      expect(r.netSalary).toBeCloseTo(r.grossIncome - r.socialSecurity - r.irt, 2);
      expect(r.netSalary).toBeGreaterThanOrEqual(0);
    }
  });

  it("aceita um regime fiscal diferente (preparado para o IRPS de 2027)", () => {
    const regimeFicticio: TaxRegime = {
      id: "teste-10-por-cento",
      name: "Regime de teste",
      validFrom: "2027-01-01",
      validTo: null,
      legalBasis: "Apenas para testes",
      sources: [],
      socialSecurityEmployeeRate: 0,
      brackets: [{ upTo: null, fixedAmount: 0, rate: 0.1, excessOver: 0 }],
    };
    const r = calculateSalary({ baseSalary: 100_000, regime: regimeFicticio });
    expect(r.irt).toBeCloseTo(10_000, 2);
    expect(r.regimeId).toBe("teste-10-por-cento");
  });

  it("rejeita valores negativos", () => {
    expect(() => calculateSalary({ baseSalary: -100 })).toThrow(RangeError);
    expect(() => calculateSalary({ baseSalary: 100, exemptAllowances: -1 })).toThrow(RangeError);
  });
});