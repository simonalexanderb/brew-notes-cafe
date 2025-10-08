import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoffeeMugRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  colorMode?: "coffee" | "flavor";
}

export const CoffeeMugRating = ({
  rating,
  onChange,
  readonly = false,
  size = "md",
  className,
  label = "Wertung",
  colorMode = "coffee",
}: CoffeeMugRatingProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Farbverlauf für Filter
  const coffeeColors = [
    "#e6d3b3", // hell
    "#c9a97a",
    "#a97c50",
    "#7c4f2b",
    "#4b2c13", // dunkel
  ];
  const flavorColors = [
    "#e6d3b3", // hell
    "#c9a97a",
    "#a97c50",
    "#7c4f2b",
    "#4b2c13", // dunkelblau
  ];
  const getColor = (bean: number) => {
    if (colorMode === "flavor") return flavorColors[bean - 1] || flavorColors[0];
    return coffeeColors[bean - 1] || coffeeColors[0];
  };

  // Label-Logik wie CoffeeRating, aber nur anzeigen wenn rating > 0
  let ratingLabel = "";
  if (rating > 0) {
    if (label?.toLowerCase().includes("geschmacksnoten")) {
      ratingLabel =
        [
          "Fruchtig/Frisch",
          "Leicht Fruchtig",
          "Schokoladig",
          "Nussig",
          "Sehr Nussig",
        ][Math.max(0, rating - 1)] || "";
    } else if (label?.toLowerCase().includes("wertung")) {
      ratingLabel =
        ["Schlecht", "Geht so", "Okay", "Lecker", "Super"][Math.max(0, rating - 1)] || "";
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium mb-1">{label}</span>
        <div className="flex flex-row items-center gap-2">
          {[1, 2, 3, 4, 5].map((bean) => (
            <Coffee
              key={bean}
              className={cn(
                sizes[size],
                "transition-all duration-300 cursor-pointer",
                !readonly && "hover:scale-110"
              )}
              style={{
                color: bean <= rating ? getColor(bean) : "hsl(var(--muted-foreground))",
                fill: bean <= rating ? getColor(bean) : "transparent",
              }}
              onClick={() => !readonly && onChange?.(bean)}
            />
          ))}
          {rating > 0 && (
            <span className="text-xs text-muted-foreground min-w-[80px] text-left">{ratingLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
};
