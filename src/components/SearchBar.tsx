import { useState } from "react";
import { Coffee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  search: string;
  setSearch: (v: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  minFlavor: number;
  setMinFlavor: (v: number) => void;
}

export function SearchBar({
  search,
  setSearch,
  minRating,
  setMinRating,
  minFlavor,
  setMinFlavor,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn(
      "relative w-full transition-all duration-300",
      focused ? "max-w-3xl" : "max-w-xl"
    )}>
      <Input
        type="text"
        placeholder="Kaffee suchen..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "bg-background border-input shadow-inner transition-all duration-300",
          focused ? "w-full text-lg px-6 py-4" : "w-full"
        )}
        style={{ zIndex: 20 }}
      />
      {focused && (
        <div className="absolute left-0 right-0 mt-2 flex justify-center gap-8 z-10 animate-fade-in">
          <div className="flex flex-col items-center cursor-pointer" onMouseDown={() => setMinRating(minRating === 5 ? 0 : minRating + 1)}>
            <Coffee className={cn("h-8 w-8", minRating > 0 ? "text-coffee-medium" : "text-muted-foreground")}/>
            <span className="text-xs mt-1">Wertung: {minRating}</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onMouseDown={() => setMinFlavor(minFlavor === 5 ? 0 : minFlavor + 1)}>
            <Coffee className={cn("h-8 w-8", minFlavor > 0 ? "text-coffee-dark" : "text-muted-foreground")}/>
            <span className="text-xs mt-1">Aromen: {minFlavor}</span>
          </div>
        </div>
      )}
    </div>
  );
}
