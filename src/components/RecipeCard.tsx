import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoffeeRating } from "./CoffeeRating";
import { Timer, Coffee, Scale, Trash2, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Recipe {
  id: string;
  beanName: string;
  packageImage?: string;
  inputGrams: number;
  outputGrams: number;
  brewingTime: number;
  grindSize: string;
  tasteRating: number;
  flavorNotesRating: number;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const RecipeCard = ({ recipe, onClick, onDelete, className }: RecipeCardProps) => {
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
        "overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer relative",
        "border-0 bg-card/80 backdrop-blur-sm group",
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
        
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-foreground truncate">
            {recipe.beanName}
          </h3>
          
          <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
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
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <CoffeeRating 
                rating={recipe.tasteRating} 
                readonly 
                size="sm" 
                label="Taste"
              />
            </div>
            <div className="space-y-1">
              <CoffeeRating 
                rating={recipe.flavorNotesRating} 
                readonly 
                size="sm" 
                label="Flavor Notes"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};