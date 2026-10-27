import { Calculator } from "@/components/calculator";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-5 py-12 sm:px-8 lg:py-16">
      <header className="flex items-start justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Salário líquido
          </h1>
          <p className="mt-3 text-muted-foreground">
            Quanto sobra do teu salário depois do IRT e da Segurança Social.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Calculator />

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        Tabela do IRT (Grupo A) em vigor em 2026, aprovada pela Lei n.º 14/25.
        Valores indicativos: confirma sempre com a tua entidade empregadora ou
        com a AGT.
      </footer>
    </main>
  );
}