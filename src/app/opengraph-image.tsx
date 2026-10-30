import { ImageResponse } from "next/og";
import { calculateSalary } from "@/lib/tax";

export const alt =
  "Calculadora de salário líquido em Angola: quanto sobra depois do IRT e da Segurança Social";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#17302C";
const MUTED = "#5B6F6A";
const NET = "#0E6B5C";
const SOCIAL = "#E2A829";
const IRT = "#C4262E";

// O exemplo vem do próprio cálculo, por isso acompanha a tabela em vigor.
const EXAMPLE_SALARY = 350_000;

/** 282745 → "282 745 Kz" (sem decimais e com espaços normais, que o tipo de letra da imagem tem). */
const kz = (value: number) =>
  `${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kz`;

const percent = (fraction: number) =>
  `${(fraction * 100).toFixed(1).replace(".", ",")} %`;

export default function OpengraphImage() {
  const result = calculateSalary({ baseSalary: EXAMPLE_SALARY });
  const share = (amount: number) => amount / result.grossIncome;

  const parts = [
    { label: "Líquido", amount: result.netSalary, color: NET },
    { label: "Segurança Social", amount: result.socialSecurity, color: SOCIAL },
    { label: "IRT", amount: result.irt, color: IRT },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F5F6F3",
          color: INK,
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: MUTED }}>
            Calculadora de IRT · Angola
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              lineHeight: 1.1,
              marginTop: 18,
              whiteSpace: "nowrap",
            }}
          >
            Quanto sobra do teu salário?
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div
              style={{
                display: "flex",
                fontSize: 120,
                lineHeight: 1,
                color: NET,
                whiteSpace: "nowrap",
              }}
            >
              {kz(result.netSalary)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: MUTED,
                marginLeft: 28,
                whiteSpace: "nowrap",
              }}
            >
              {`de ${kz(result.grossIncome)} brutos`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              height: 28,
              borderRadius: 14,
              overflow: "hidden",
              marginTop: 30,
              background: "#E8ECE6",
            }}
          >
            {parts.map((part) => (
              <div
                key={part.label}
                style={{
                  width: `${share(part.amount) * 100}%`,
                  background: part.color,
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", marginTop: 24, fontSize: 28 }}>
            {parts.map((part) => (
              <div
                key={part.label}
                style={{ display: "flex", alignItems: "center", marginRight: 48 }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background: part.color,
                    marginRight: 12,
                  }}
                />
                <div style={{ display: "flex", whiteSpace: "nowrap" }}>
                  {`${part.label} ${percent(share(part.amount))}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
