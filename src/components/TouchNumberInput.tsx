import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TouchNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}

export const TouchNumberInput = ({
  value,
  onChange,
  label,
  placeholder,
  min = 0,
  max = 999,
  step = 0.5,
  unit,
  className
}: TouchNumberInputProps) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(Math.min(max, Math.max(min, newValue)));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrease}
          disabled={value <= min}
          className="h-12 w-12 rounded-full shrink-0 border-coffee-light hover:bg-coffee-light"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 relative">
          <input
            type="number"
            value={value || ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={cn(
              "w-full h-12 px-4 text-center text-lg font-medium",
              "bg-background border-2 border-coffee-light rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-coffee-medium focus:border-transparent",
              "appearance-none"
            )}
            style={{
              /* Hide number input spinners */
              MozAppearance: "textfield"
            }}
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrease}
          disabled={value >= max}
          className="h-12 w-12 rounded-full shrink-0 border-coffee-light hover:bg-coffee-light"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};