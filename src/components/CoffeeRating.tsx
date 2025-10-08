import { Coffee, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoffeeRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export const CoffeeRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = "md",
  className,
  label = "Rating"
}: CoffeeRatingProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const getIntensity = (beanIndex: number, rating: number) => {
    if (beanIndex <= rating) {
      // Fünf Brauntöne von sehr hell bis dunkel
      const coffeeColors = [
        "hsl(30, 40%, 80%)", // sehr hellbeige
        "hsl(30, 45%, 65%)", // hellbraun
        "hsl(30, 50%, 50%)", // mittelbraun
        "hsl(30, 55%, 35%)", // dunkelbraun
        "hsl(30, 60%, 25%)", // sehr dunkel
      ];
      return coffeeColors[beanIndex - 1];
    }
    // Graue/neutralisierte Tasse für nicht-aktive Bewertung
    return "hsl(var(--muted-foreground))";
  };

  // Label-Logik für Geschmack und Aromen
  let ratingLabel = "";
  if (label?.toLowerCase().includes("geschmacksnoten")) {
    // Flavor Complexity
    ratingLabel =
      [
        "Fruchtig/Frisch",
        "Leicht Fruchtig",
        "Schokoladig",
        "Nussig",
        "Sehr Nussig",
      ][Math.max(0, rating - 1)] || "Nicht bewertet";
  } else if (label?.toLowerCase().includes("wertung")) {
    // Taste Quality
    ratingLabel =
      ["Schlecht", "Geht so", "Okay", "Lecker", "Super"][
        Math.max(0, rating - 1)
      ] || "Nicht bewertet";
  } else {
    ratingLabel = rating === 0 ? "Nicht bewertet" : rating.toString();
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{ratingLabel}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((bean) => (
          <Coffee
            key={bean}
            className={cn(
              sizes[size],
              "transition-all duration-300 cursor-pointer",
              !readonly && "hover:scale-110"
            )}
            style={{
              color: getIntensity(bean, rating),
              fill: bean <= rating ? getIntensity(bean, rating) : "transparent",
            }}
            onClick={() => !readonly && onRatingChange?.(bean)}
          />
        ))}
      </div>
      {!readonly && (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onRatingChange?.(Math.max(0, rating - 1))}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            disabled={rating === 0}
          >
            <Minus className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onRatingChange?.(Math.min(5, rating + 1))}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            disabled={rating === 5}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};