import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Coffee, Scale, Trash2, Play } from "lucide-react";
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
  // Optional taste profile fields
  // Optional taste profile fields
  sweetness?: number;
  acidity?: number;
  body?: number;
  flavor?: number;
  aroma_tags?: string;
  // New fields
  isArchived?: boolean;
  brewCount?: number;
  brewMethod?: string;
  filterInputGrams?: number;
  filterWaterGrams?: number;
  filterBrewingTemperature?: number;
  filterBloomingTime?: number;
  filterBrewingTime?: number;
  filterGrindSize?: number;
  filterAromaTags?: string;
  // Filter Flavor
  filterTasteRating?: number;
  filterFlavorNotesRating?: number;
  filterFragrance?: number;
  filterAroma?: number;
  filterFlavor?: number;
  filterSweetness?: number;
  filterAcidity?: number;
  filterBody?: number;
  filterAftertaste?: number;
  filterBalance?: number;
  filter_aroma_tags?: string; // fallback if needed
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  className?: string;
  onDelete?: (id: string) => void;
  onArchive?: (recipe: Recipe) => void;
  onStartBrew?: () => void;
  forcedMethod?: "espresso" | "filter";
}

export const RecipeCard = ({
  recipe,
  onClick,
  className,
  onDelete,
  onArchive,
  onStartBrew,
  forcedMethod,
}: RecipeCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipe.id) onDelete?.(recipe.id);
    setIsDeleting(false);
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive?.(recipe);
  };

  // Use forcedMethod if provided (for list filtering), otherwise fall back to saved default
  const effectiveMethod = forcedMethod || recipe.brewMethod || "espresso";
  const isFilter = effectiveMethod === "filter";

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentAromaTags = isFilter ? recipe.filterAromaTags : recipe.aroma_tags;
  const tagsList = currentAromaTags ? currentAromaTags.split(",").filter(Boolean) : [];

  // Check availability
  const hasEspresso = recipe.inputGrams > 0;
  const hasFilter = (recipe.filterInputGrams || 0) > 0;
  const showDualLabel = !forcedMethod && hasEspresso && hasFilter;

  // Determine display label
  let methodLabel = isFilter ? "Filter Coffee" : "Espresso";
  if (showDualLabel) {
    methodLabel = "Espresso | Filter";
  }

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-sm transition-all duration-300 cursor-pointer relative",
        "border-0 bg-card/70 backdrop-blur group hover:shadow-md",
        recipe.isArchived && "opacity-60 grayscale-[0.5]",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Actions (Delete / Archive) */}
        <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button
            variant="secondary"
            size="icon"
            onClick={handleArchiveClick}
            className="h-8 w-8 rounded-full shadow-lg bg-white/90 hover:bg-white"
            title={recipe.isArchived ? "Unarchive" : "Archive"}
          >
            {recipe.isArchived ? (
              <span className="text-xs">↩️</span>
            ) : (
              <span className="text-xs">📦</span>
            ) }
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteClick}
            className="h-8 w-8 rounded-full shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Header Image - Full Width to match corners */}
        <div className="relative h-48 bg-[#F8F5F2]">
          {recipe.packageImage ? (
            <img
              src={recipe.packageImage}
              alt={recipe.beanName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
              <Coffee className="h-12 w-12" />
            </div>
          )}
          
          {/* Brew Count Badge */}
          <div className="absolute top-3 left-3 z-10">
             <div className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
               <span className="font-bold">{recipe.brewCount || 0}</span> Brews
             </div>
          </div>
          
           {/* Archived Badge */}
           {recipe.isArchived && (
            <div className="absolute top-3 left-20 z-10">
               <div className="bg-orange-500/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
                 Archived
               </div>
            </div>
          )}

          {/* Play Button positioned over image bottom right */}
          <div className="absolute bottom-3 right-3 z-10">
             <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onStartBrew?.();
              }}
              className={cn(
                "h-8 w-8 rounded-full shadow-md p-0",
                "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
            >
              <Play className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-4">
          {/* Title Section */}
          <div className="space-y-0.5 pt-4">
            <h3 className="font-bold text-xl text-foreground truncate">
              {recipe.beanName}
            </h3>
            {/* Secondary Line: Method */}
            <p className="text-sm text-[#A59A92] font-medium truncate uppercase tracking-wider">
              {methodLabel}
            </p>
          </div>

          {/* Brew Parameters Grid */}
          <div className="grid grid-cols-4 divide-x divide-gray-100 py-2">
            <div className="flex flex-col items-center text-center px-1">
              <span className="font-bold text-foreground text-sm">
                {isFilter ? recipe.filterInputGrams : recipe.inputGrams}g
              </span>
              <span className="text-[10px] text-[#8B8179] uppercase tracking-wider mt-0.5">Dose</span>
            </div>
            
            {isFilter ? (
              // Filter Fields
              <>
                 <div className="flex flex-col items-center text-center px-1">
                  <span className="font-bold text-foreground text-sm">{recipe.filterWaterGrams}ml</span>
                  <span className="text-[10px] text-[#8B8179] uppercase tracking-wider mt-0.5">Water</span>
                </div>
                 <div className="flex flex-col items-center text-center px-1">
                  <span className="font-bold text-foreground text-sm">{formatTime(recipe.filterBrewingTime || 0)}</span>
                  <span className="text-[10px] text-[#8B8179] uppercase tracking-wider mt-0.5">Time</span>
                </div>
                <div className="flex flex-col items-center text-center px-1">
                  <span className="font-bold text-foreground text-sm">{recipe.filterGrindSize}</span>
                  <span className="text-[10px] text-[#8B8179] uppercase tracking-wider mt-0.5">Grind</span>
                </div>
              </>
            ) : (
              // Espresso Fields
              <>
                <div className="flex flex-col items-center text-center px-1">
                  <span className="font-bold text-foreground text-sm">{recipe.outputGrams}g</span>
                  <span className="text-[10px] text-[#8B8179] uppercase tracking-wider mt-0.5">Out</span>
                </div>
                <div className="flex flex-col items-center text-center px-1">
                  <span className="font-bold text-foreground text-sm">{formatTime(recipe.brewingTime || 0)}</span>
                  <span className="text-[10px] text-[#8B8179] uppercase tracking-wider mt-0.5">Time</span>
                </div>
                <div className="flex flex-col items-center text-center px-1">
                  <span className="font-bold text-foreground text-sm">{recipe.grindSize}</span>
                  <span className="text-[10px] text-[#8B8179] uppercase tracking-wider mt-0.5">Grind</span>
                </div>
              </>
            )}
          </div>

          {/* Tags and Radar Layout */}
          <div className="flex items-end justify-between gap-2 pt-1">
            {/* Tags (Left) */}
            <div className="flex-1 pb-2">
              {tagsList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {tagsList.map((tag, i) => (
                    <span
                      key={i} 
                      className="text-[11px] px-2 py-0.5 bg-[#F8F5F2] border border-[#E3DDD7] rounded-md text-foreground/80 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic">Keine Tags</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
