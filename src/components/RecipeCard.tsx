import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { Timer, Coffee, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

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
  className?: string;
}

export const RecipeCard = ({ recipe, onClick, className }: RecipeCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer",
        "border-0 bg-card/80 backdrop-blur-sm",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
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
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taste</span>
              <StarRating rating={recipe.tasteRating} readonly size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Flavor</span>
              <StarRating rating={recipe.flavorNotesRating} readonly size="sm" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};