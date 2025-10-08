import { useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CoffeeMugRating } from "./CoffeeMugRating";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableSearchBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: { wertung: number; geschmacksnoten: number }) => void;
  className?: string;
  onExpandChange?: (expanded: boolean) => void;
}

export const ExpandableSearchBar = ({
  onSearch,
  onFilterChange,
  className,
  onExpandChange,
}: ExpandableSearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wertung, setWertung] = useState(0);
  const [geschmacksnoten, setGeschmacksnoten] = useState(0);

  // Helper, synchronisiert isExpanded mit Parent
  const setExpanded = (v: boolean) => {
    setIsExpanded(v);
    onExpandChange?.(v);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  // Filter-Callback bei Änderung
  const handleWertungChange = (v: number) => {
    setWertung(v);
    onFilterChange?.({ wertung: v, geschmacksnoten });
  };
  const handleGeschmacksnotenChange = (v: number) => {
    setGeschmacksnoten(v);
    onFilterChange?.({ wertung, geschmacksnoten: v });
  };
  const handleClose = () => {
    setExpanded(false);
  };

  return (
    <div className={cn("w-full transition-all duration-300", className)}>
      <div
        className={cn(
          "relative transition-all duration-300",
          isExpanded ? "mb-6" : ""
        )}
      >
        <div className="relative w-full flex items-center">
          <Input
            type="text"
            placeholder="Kaffee suchen..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            // Entferne automatisches Öffnen beim Fokus
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setExpanded(false);
              }
            }}
            className={cn(
              "w-full bg-input border-border text-foreground placeholder:text-muted-foreground",
              "transition-all duration-300 text-base",
              "focus:ring-2 focus:ring-ring focus:border-transparent",
              isExpanded ? "h-14 text-lg" : "h-12"
            )}
          />
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 flex items-center"
            aria-label={isExpanded ? "Filter schließen" : "Filter öffnen"}
            tabIndex={-1}
          >
            {isExpanded ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
            </svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
              </svg>
            )}
          </button>
        </div>
  {/* Kein X-Button mehr in der Searchbar */}
      </div>

      <div
        ref={filterRef}
        className={cn(
          "overflow-hidden transition-all duration-300 space-y-4",
          isExpanded
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-card rounded-lg p-4 border border-border space-y-2">
          {/* Kein Close-Button mehr im Filterbereich, das macht jetzt der Toggle-Button in der Searchbar */}
          <div className="flex flex-col gap-1 justify-center">
            <span className="text-sm font-medium text-foreground">Wertung</span>
            <div className="flex flex-row items-center w-full justify-between">
              <div className="flex flex-row items-center gap-2">
                <CoffeeMugRating
                  rating={wertung}
                  onChange={handleWertungChange}
                  className="justify-start"
                  colorMode="coffee"
                  label=""
                />
              </div>
              {wertung > 0 && (
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    handleWertungChange(0);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 flex items-center ml-2"
                  aria-label="Wertung zurücksetzen"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-1 justify-center">
            <span className="text-sm font-medium text-foreground">Geschmacksnoten</span>
            <div className="flex flex-row items-center w-full justify-between">
              <div className="flex flex-row items-center gap-2">
                <CoffeeMugRating
                  rating={geschmacksnoten}
                  onChange={handleGeschmacksnotenChange}
                  className="justify-start"
                  colorMode="flavor"
                  label=""
                />
              </div>
              {geschmacksnoten > 0 && (
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    handleGeschmacksnotenChange(0);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 flex items-center ml-2"
                  aria-label="Geschmacksnoten zurücksetzen"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
