import { formatKz, formatPercent } from "@/lib/format";
import type { SalaryResult } from "@/lib/tax";

interface SalaryStripProps {
  result: SalaryResult;
}

export function SalaryStrip({ result }: SalaryStripProps) {
  const gross = result.grossIncome;
  const share = (amount: number) => (gross > 0 ? amount / gross : 0);

  const parts = [
    { key: "liquido", label: "Líquido", amount: result.netSalary, color: "bg-liquido" },
    { key: "seguranca", label: "Segurança Social", amount: result.socialSecurity, color: "bg-seguranca" },
    { key: "irt", label: "IRT", amount: result.irt, color: "bg-irt" },
  ];

  const description = parts
    .map((p) => `${p.label}: ${formatKz(p.amount)}, ${formatPercent(share(p.amount))}`)
    .join(". ");

  return (
    <div>
      <div
        role="img"
        aria-label={`Divisão do rendimento bruto. ${description}`}
        className="flex h-5 w-full overflow-hidden rounded-full bg-muted"
      >
        {parts.map((p) => (
          <div
            key={p.key}
            className={`${p.color} h-full transition-[width] duration-300 ease-out motion-reduce:transition-none`}
            style={{ width: `${share(p.amount) * 100}%` }}
          />
        ))}
      </div>

      <ul className="mt-5 grid gap-3">
        {parts.map((p) => (
          <li
            key={p.key}
            className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3"
          >
            <span aria-hidden className={`${p.color} size-3 rounded-sm`} />
            <span>{p.label}</span>
            <span className="tabular-nums">
              {formatKz(p.amount)}{" "}
              <span className="text-muted-foreground">
                {formatPercent(share(p.amount))}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}