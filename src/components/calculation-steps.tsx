import { formatKz, formatPercent } from "@/lib/format";
import type { SalaryResult, TaxRegime } from "@/lib/tax";

interface CalculationStepsProps {
  result: SalaryResult;
  regime: TaxRegime;
  /** Valor sobre o qual incide a Segurança Social. */
  socialSecurityBase: number;
}

export function CalculationSteps({
  result,
  regime,
  socialSecurityBase,
}: CalculationStepsProps) {
  const { bracket, bracketIndex } = result;

  const irtDetail =
    bracket.rate === 0
      ? "Rendimento dentro do limite de isenção: não há IRT."
      : `${formatKz(bracket.fixedAmount)} + (${formatKz(result.taxableIncome)} − ${formatKz(bracket.excessOver)}) × ${formatPercent(bracket.rate)}`;

  const steps = [
    {
      title: "Rendimento bruto",
      detail: "Salário base + subsídios",
      value: result.grossIncome,
    },
    {
      title: "Segurança Social",
      detail: `${formatPercent(regime.socialSecurityEmployeeRate)} × ${formatKz(socialSecurityBase)}`,
      value: result.socialSecurity,
    },
    {
      title: "Matéria colectável",
      detail: "Salário base + subsídios sujeitos a IRT − Segurança Social",
      value: result.taxableIncome,
    },
    {
      title: `IRT, ${bracketIndex + 1}.º escalão`,
      detail: irtDetail,
      value: result.irt,
    },
    {
      title: "Salário líquido",
      detail: "Rendimento bruto − Segurança Social − IRT",
      value: result.netSalary,
    },
  ];

  return (
    <ol className="grid gap-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3"
        >
          <span aria-hidden className="text-sm tabular-nums text-muted-foreground">
            {index + 1}.
          </span>
          <div>
            <p className="font-medium">{step.title}</p>
            <p className="text-sm text-muted-foreground">{step.detail}</p>
          </div>
          <p className="tabular-nums">{formatKz(step.value)}</p>
        </li>
      ))}
    </ol>
  );
}