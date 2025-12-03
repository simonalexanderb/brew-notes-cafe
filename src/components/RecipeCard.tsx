import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoffeeRating } from "./CoffeeRating";
import { Timer, Coffee, Scale, Trash2, MoreVertical, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Recipe {
  id: string;
  beanName: string;
  packageImage?: string;
  inputGrams: number;
  outputGrams: number;
  brewingTime: number;
  grindSize: number;
  tasteRating: number;
  flavorNotesRating: number;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onDelete?: () => void;
  onStartBrew?: () => void;
  className?: string;
}

export const RecipeCard = ({
  recipe,
  onClick,
  onDelete,
  onStartBrew,
  className,
}: RecipeCardProps) => {
  const [showActions, setShowActions] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${recipe.beanName}" recipe?`)) {
      onDelete?.();
    }
  };
  return (
    <Card
      className={cn(
        "overflow-hidden shadow-sm transition-all duration-300 cursor-pointer relative",
        "border-0 bg-card/70 backdrop-blur group",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Delete button */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteClick}
            className="h-8 w-8 rounded-full shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>


        {recipe.packageImage && (
          <div className="aspect-[4/3] overflow-hidden bg-coffee-light">
            <img
              src={recipe.packageImage}
              alt={recipe.beanName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Extra spacing after image */}
        <div className="h-2" />

        <div className="p-4 space-y-3">
          {/* Heading with Play button */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-lg text-foreground truncate flex-1">
              {recipe.beanName}
            </h3>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onStartBrew?.();
              }}
              className={cn(
                "gap-1.5 shadow-soft shrink-0",
                "bg-gradient-coffee hover:opacity-90 text-primary-foreground"
              )}
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Scale className="h-3 w-3" />
              <span>{recipe.inputGrams}g</span>
            </div>
            <div className="flex items-center gap-1">
              <Coffee className="h-3 w-3" />
              <span>{recipe.outputGrams}g</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              <span>{recipe.brewingTime}s</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Grind: {recipe.grindSize}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <CoffeeRating
                rating={recipe.tasteRating}
                readonly
                size="sm"
                label="Wertung"
              />
            </div>
            <div className="space-y-1">
              <CoffeeRating
                rating={recipe.flavorNotesRating}
                readonly
                size="sm"
                label="Geschmacksnoten"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};