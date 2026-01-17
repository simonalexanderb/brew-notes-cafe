
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TimeInputProps {
  value: number; // Total seconds
  onChange: (value: number) => void;
  label: string;
  className?: string;
}

export const TimeInput = ({
  value,
  onChange,
  label,
  className
}: TimeInputProps) => {
  const [minutes, setMinutes] = useState(Math.floor(value / 60));
  const [seconds, setSeconds] = useState(value % 60);

  useEffect(() => {
    setMinutes(Math.floor(value / 60));
    setSeconds(value % 60);
  }, [value]);

  const updateTime = (m: number, s: number) => {
    const total = m * 60 + s;
    onChange(total);
  };

  const handleDecrease = () => {
    const newValue = Math.max(0, value - 1);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = value + 1;
    onChange(newValue);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m = Math.max(0, parseInt(e.target.value) || 0);
    updateTime(m, seconds);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let s = Math.max(0, parseInt(e.target.value) || 0);
    // Auto-rollover if > 59? optional, but sticking to standard input for now
    updateTime(minutes, s);
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
          disabled={value <= 0}
          className="h-12 w-12 rounded-full shrink-0 border-coffee-light hover:bg-coffee-light"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 flex items-center justify-center gap-2 bg-background border-2 border-coffee-light rounded-lg h-12 px-2">
          <input
            type="text"
            inputMode="numeric"
            value={minutes}
            onChange={handleMinutesChange}
            className="w-12 text-center text-lg font-medium bg-transparent focus:outline-none appearance-none p-0 m-0"
            placeholder="0"
          />
          <span className="text-lg font-bold pb-1">:</span>
          <input
            type="text"
            inputMode="numeric"
            value={seconds.toString().padStart(2, '0')}
            onChange={handleSecondsChange}
            className="w-12 text-center text-lg font-medium bg-transparent focus:outline-none appearance-none p-0 m-0"
            placeholder="00"
          />
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrease}
          className="h-12 w-12 rounded-full shrink-0 border-coffee-light hover:bg-coffee-light"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
