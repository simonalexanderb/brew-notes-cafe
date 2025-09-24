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
    lg: "h-6 w-6"
  };

  const getIntensity = (beanIndex: number) => {
    if (beanIndex <= rating) {
      const intensity = (beanIndex / 5) * 100;
      return `hsl(25 ${Math.min(45 + intensity * 0.3, 65)}% ${Math.max(20, 40 - intensity * 0.2)}%)`;
    }
    return "hsl(var(--muted-foreground))";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {rating === 0 ? "Not rated" : 
           rating <= 2 ? "Poor" :
           rating <= 3 ? "Fair" :
           rating <= 4 ? "Good" : "Excellent"}
        </span>
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
              color: getIntensity(bean),
              fill: bean <= rating ? getIntensity(bean) : "transparent"
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