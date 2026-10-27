"use client";

import { useMemo, useState } from "react";
import { BracketTable } from "@/components/bracket-table";
import { CalculationSteps } from "@/components/calculation-steps";
import { MoneyField } from "@/components/money-field";
import { SalaryStrip } from "@/components/salary-strip";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatAmountInput,
  formatKz,
  formatPercent,
  parseAmount,
} from "@/lib/format";
import { calculateSalary, IRT_GRUPO_A_2026 } from "@/lib/tax";

const REGIME = IRT_GRUPO_A_2026;

export function Calculator() {
  const [baseSalary, setBaseSalary] = useState("350 000");
  const [taxableAllowances, setTaxableAllowances] = useState("");
  const [exemptAllowances, setExemptAllowances] = useState("");
  const [socialSecurityOnAllowances, setSocialSecurityOnAllowances] =
    useState(false);

  const amounts = useMemo(() => {
    const base = parseAmount(baseSalary);
    const taxable = parseAmount(taxableAllowances);
    const exempt = parseAmount(exemptAllowances);
    return {
      base,
      taxable,
      exempt,
      socialSecurityBase: socialSecurityOnAllowances ? base + taxable : base,
    };
  }, [baseSalary, taxableAllowances, exemptAllowances, socialSecurityOnAllowances]);

  const result = useMemo(
    () =>
      calculateSalary({
        baseSalary: amounts.base,
        taxableAllowances: amounts.taxable,
        exemptAllowances: amounts.exempt,
        socialSecurityBase: socialSecurityOnAllowances
          ? "base-and-allowances"
          : "base",
        regime: REGIME,
      }),
    [amounts, socialSecurityOnAllowances],
  );

  const tidy = (text: string) => formatAmountInput(parseAmount(text));
  const hasIncome = result.grossIncome > 0;
  const withheldShare = hasIncome ? 1 - result.netSalary / result.grossIncome : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
      {/* Barra fixa: só aparece no telemóvel, para o líquido ficar sempre visível */}
      <div
        aria-hidden="true"
        className="sticky top-0 z-10 -mx-5 flex items-baseline justify-between gap-4 border-b bg-background/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:hidden"
      >
        <span className="text-sm text-muted-foreground">Recebes por mês</span>
        <span className="font-display text-xl font-semibold tabular-nums">
          {formatKz(result.netSalary)}
        </span>
      </div>

      <form
        aria-label="Dados do recibo"
        className="grid content-start gap-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <h2 className="font-display text-2xl font-semibold">Dados do recibo</h2>

        <MoneyField
          id="salario-base"
          label="Salário base"
          placeholder="Ex.: 350 000"
          value={baseSalary}
          onChange={setBaseSalary}
          onCommit={() => setBaseSalary(tidy(baseSalary))}
        />

        <MoneyField
          id="subsidios-sujeitos"
          label="Subsídios sujeitos a IRT"
          hint="Prémios e a parte dos subsídios acima do limite de isenção."
          value={taxableAllowances}
          onChange={setTaxableAllowances}
          onCommit={() => setTaxableAllowances(tidy(taxableAllowances))}
        />

        <MoneyField
          id="subsidios-isentos"
          label="Subsídios isentos de IRT"
          hint="A parte dos subsídios que a lei isenta de IRT."
          value={exemptAllowances}
          onChange={setExemptAllowances}
          onCommit={() => setExemptAllowances(tidy(exemptAllowances))}
        />

        <div className="flex items-start gap-3 border-t pt-6">
          <Switch
            id="ss-sobre-subsidios"
            checked={socialSecurityOnAllowances}
            onCheckedChange={setSocialSecurityOnAllowances}
            className="mt-0.5"
          />
          <div className="grid gap-1">
            <Label
              htmlFor="ss-sobre-subsidios"
              className="text-base leading-snug"
            >
              Segurança Social também sobre os subsídios sujeitos a IRT
            </Label>
            <p className="text-sm text-muted-foreground">
              Por defeito, os 3% incidem só sobre o salário base. Algumas
              fontes aplicam-nos a mais rendimentos, por isso podes escolher.
            </p>
          </div>
        </div>
      </form>

      <section className="lg:sticky lg:top-10 lg:self-start">
        <Card className="rounded-2xl">
          <CardContent className="grid gap-6 p-6 sm:p-8">
            <div aria-live="polite">
              <p className="text-sm text-muted-foreground">Recebes por mês</p>
              <p className="mt-1 font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-5xl">
                {formatKz(result.netSalary)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {hasIncome
                  ? `Descontas ${formatPercent(withheldShare)} do rendimento bruto de ${formatKz(result.grossIncome)}.`
                  : "Escreve o salário base para ver o cálculo."}
              </p>
            </div>

            <SalaryStrip result={result} />

            <Tabs defaultValue="passos" className="border-t pt-6">
              <TabsList>
                <TabsTrigger value="passos">Passo a passo</TabsTrigger>
                <TabsTrigger value="escaloes">Escalões do IRT</TabsTrigger>
              </TabsList>

              <TabsContent value="passos" className="pt-5">
                <CalculationSteps
                  result={result}
                  regime={REGIME}
                  socialSecurityBase={amounts.socialSecurityBase}
                />
              </TabsContent>

              <TabsContent value="escaloes" className="grid gap-4 pt-5">
                <BracketTable
                  regime={REGIME}
                  activeIndex={hasIncome ? result.bracketIndex : -1}
                />
                <p className="text-sm text-muted-foreground">
                  Tabela em vigor desde 1 de Janeiro de 2026 (Lei n.º 14/25, de
                  30 de Dezembro). Pela tabela publicada, quem ultrapassa os
                  150 000 Kz de matéria colectável paga logo a parcela fixa do
                  escalão seguinte.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}