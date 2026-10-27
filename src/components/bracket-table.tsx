import { formatAmountInput, formatPercent } from "@/lib/format";
import type { TaxRegime } from "@/lib/tax";

interface BracketTableProps {
  regime: TaxRegime;
  /** Índice do escalão em uso, ou -1 para não destacar nenhum. */
  activeIndex: number;
}

const amount = (value: number) => formatAmountInput(value) || "0";

export function BracketTable({ regime, activeIndex }: BracketTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-sm tabular-nums">
        <caption className="sr-only">Escalões do IRT, Grupo A</caption>
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th scope="col" className="py-2 pr-4 font-normal">
              Matéria colectável (Kz)
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-normal">
              Parcela fixa
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-normal">
              Taxa
            </th>
            <th scope="col" className="py-2 text-right font-normal">
              Excesso sobre
            </th>
          </tr>
        </thead>
        <tbody>
          {regime.brackets.map((bracket, index) => {
            const previousLimit =
              index === 0 ? 0 : (regime.brackets[index - 1].upTo ?? 0);
            const range =
              index === 0
                ? `Até ${amount(bracket.upTo ?? 0)}`
                : bracket.upTo === null
                  ? `Mais de ${amount(previousLimit)}`
                  : `${amount(previousLimit + 1)} a ${amount(bracket.upTo)}`;
            const isActive = index === activeIndex;

            return (
              <tr
                key={bracket.excessOver}
                aria-current={isActive ? "true" : undefined}
                className={
                  isActive ? "bg-primary/10 font-medium" : "border-b border-border/60"
                }
              >
                <td className="py-2 pr-4">{range}</td>
                <td className="py-2 pr-4 text-right">{amount(bracket.fixedAmount)}</td>
                <td className="py-2 pr-4 text-right">{formatPercent(bracket.rate)}</td>
                <td className="py-2 text-right">
                  {bracket.rate === 0 ? "—" : amount(bracket.excessOver)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}