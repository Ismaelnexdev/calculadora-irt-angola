import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MoneyFieldProps {
  id: string;
  label: string;
  hint?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  /** Chamado ao sair do campo, para arrumar o formato. */
  onCommit: () => void;
}

export function MoneyField({
  id,
  label,
  hint,
  placeholder,
  value,
  onChange,
  onCommit,
}: MoneyFieldProps) {
  const hintId = `${id}-hint`;

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-base">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          maxLength={18}
          placeholder={placeholder}
          value={value}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) =>
            onChange(event.target.value.replace(/[^\d.,\s]/g, ""))
          }
          onBlur={onCommit}
          className="h-12 pr-12 text-lg tabular-nums"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground"
        >
          Kz
        </span>
      </div>
      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}