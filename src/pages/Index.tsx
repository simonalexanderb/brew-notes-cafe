import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeForm } from "@/components/RecipeForm";
import { Plus, Coffee, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover } from "@/components/ui/popover";
import { ExpandableSearchBar } from "@/components/ExpandableSearchBar";
import { BrewingSession } from "@/components/BrewingSession";
import { cn } from "@/lib/utils";
import * as api from "@/lib/api";

// Frontend-Modell
type Recipe = {
  id: string;
  beanName: string;
  packageImage?: string;
  inputGrams: number;
  outputGrams: number;
  brewingTime: number;
  grindSize: number;
  tasteRating: number;
  flavorNotesRating: number;
  // New fields
  fragrance?: number;
  aroma?: number;
  flavor?: number;
  sweetness?: number;
  acidity?: number;
  body?: number;
  aftertaste?: number;
  balance?: number;
  aroma_tags?: string;
  // New features
  isArchived?: boolean;
  brewCount?: number;
  brewMethod?: string;
  filterInputGrams?: number;
  filterWaterGrams?: number;
  filterBrewingTemperature?: number;
  filterBloomingTime?: number;
  filterBrewingTime?: number;
  filterGrindSize?: number;
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
  filterAromaTags?: string;
};

// Mapping Backend <-> Frontend
function backendToFrontend(r: api.Recipe): Recipe {
  return {
    id: r.id ? String(r.id) : String(Date.now()),
    beanName: r.bean_name || "",
    packageImage: r.image || "",
    inputGrams: r.input_grams ?? 0,
    outputGrams: r.output_grams ?? 0,
    brewingTime: r.brewing_time ?? 0,
    grindSize: r.grind_size ?? 0,
    tasteRating: r.taste_rating ?? 0,
    flavorNotesRating: r.flavor_complexity ?? 0,
    fragrance: r.fragrance,
    aroma: r.aroma,
    flavor: r.flavor,
    sweetness: r.sweetness,
    acidity: r.acidity,
    body: r.body,
    aftertaste: r.aftertaste,
    balance: r.balance,
    aroma_tags: r.aroma_tags,
    isArchived: r.is_archived || false,
    brewCount: r.brew_count || 0,
    brewMethod: r.brew_method || "espresso",
    filterInputGrams: r.filter_input_grams || 0,
    filterWaterGrams: r.filter_water_grams || 0,
    filterBrewingTemperature: r.filter_brewing_temperature || 0,
    filterBloomingTime: r.filter_blooming_time || 0,
    filterBrewingTime: r.filter_brewing_time || 0,
    filterGrindSize: r.filter_grind_size || 0,
    filterTasteRating: r.filter_taste_rating || 0,
    filterFlavorNotesRating: r.filter_flavor_complexity || 0,
    filterFragrance: r.filter_fragrance || 0,
    filterAroma: r.filter_aroma || 0,
    filterFlavor: r.filter_flavor || 0,
    filterSweetness: r.filter_sweetness || 0,
    filterAcidity: r.filter_acidity || 0,
    filterBody: r.filter_body || 0,
    filterAftertaste: r.filter_aftertaste || 0,
    filterBalance: r.filter_balance || 0,
    filterAromaTags: r.filter_aroma_tags || "",
  };
}

function frontendToBackend(r: Omit<Recipe, "id">): Omit<api.Recipe, "id"> {
  return {
    bean_name: r.beanName,
    image: r.packageImage,
    input_grams: r.inputGrams,
    output_grams: r.outputGrams,
    brewing_time: r.brewingTime,
    grind_size: r.grindSize,
    taste_rating: r.tasteRating,
    flavor_complexity: r.flavorNotesRating,
    fragrance: r.fragrance,
    aroma: r.aroma,
    flavor: r.flavor,
    sweetness: r.sweetness,
    acidity: r.acidity,
    body: r.body,
    aftertaste: r.aftertaste,
    balance: r.balance,
    aroma_tags: r.aroma_tags,
    is_archived: r.isArchived,
    brew_count: r.brewCount,
    brew_method: r.brewMethod,
    filter_input_grams: r.filterInputGrams,
    filter_water_grams: r.filterWaterGrams,
    filter_brewing_temperature: r.filterBrewingTemperature,
    filter_blooming_time: r.filterBloomingTime,
    filter_brewing_time: r.filterBrewingTime,
    filter_grind_size: r.filterGrindSize,
    filter_taste_rating: r.filterTasteRating,
    filter_flavor_complexity: r.filterFlavorNotesRating,
    filter_fragrance: r.filterFragrance,
    filter_aroma: r.filterAroma,
    filter_flavor: r.filterFlavor,
    filter_sweetness: r.filterSweetness,
    filter_acidity: r.filterAcidity,
    filter_body: r.filterBody,
    filter_aftertaste: r.filterAftertaste,
    filter_balance: r.filterBalance,
    filter_aroma_tags: r.filterAromaTags,
  };
}

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [brewingRecipe, setBrewingRecipe] = useState<Recipe | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchbarExpanded, setSearchbarExpanded] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<"all" | "espresso" | "filter">("espresso");
  const [filter, setFilter] = useState<{
    wertung: number;
    geschmacksnoten: number;
  }>({ wertung: 0, geschmacksnoten: 0 });

  // ... (rest of state and effects)

  // ... (later in JSX)

                 {/* Category Toggle (Centered on desktop, full width on mobile) */}
                 <div className="flex p-1 bg-muted rounded-lg self-start sm:self-center">
                  <button
                    onClick={() => setCategory("espresso")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                      category === "espresso" 
                        ? "bg-white text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Espresso
                  </button>
                  <button
                    onClick={() => setCategory("filter")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                      category === "filter" 
                        ? "bg-white text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Filter
                  </button>
                  <button
                    onClick={() => setCategory("all")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                      category === "all" 
                        ? "bg-white text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    All
                  </button>
                </div>

  // Backend laden
  useEffect(() => {
    setLoading(true);
    api
      .fetchRecipes()
      .then((data) => setRecipes(data.map(backendToFrontend)))
      .catch(() => setError("Fehler beim Laden der Rezepte vom Server."))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveRecipe = async (recipeData: Omit<Recipe, "id">) => {
    setLoading(true);
    setError(null);
    try {
      if (editingRecipe) {
        // Update
        const updated = await api.updateRecipe(
          Number(editingRecipe.id),
          frontendToBackend(recipeData)
        );
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === editingRecipe.id ? backendToFrontend(updated) : r
          )
        );
      } else {
        // Neu anlegen
        const newRecipe = await api.createRecipe(frontendToBackend(recipeData));
        setRecipes((prev) => [backendToFrontend(newRecipe), ...prev]);
      }
      setShowForm(false);
      setEditingRecipe(null);
    } catch (e) {
      setError(
        editingRecipe
          ? "Fehler beim Aktualisieren des Rezepts."
          : "Fehler beim Anlegen des Rezepts."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecipe = async (id: number, recipeData: any) => {
    setLoading(true);
    try {
      // recipeData comes from BrewingSession and is already in Frontend format (mostly)
      // We need to ensure it matches the Recipe interface before converting
      const updated = await api.updateRecipe(id, frontendToBackend(recipeData));
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === String(id) ? backendToFrontend(updated) : r
        )
      );
    } catch (e) {
      setError("Fehler beim Aktualisieren des Rezepts.");
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveRecipe = async (recipe: Recipe) => {
    setLoading(true);
    try {
      const updated = await api.updateRecipe(Number(recipe.id), frontendToBackend({
        ...recipe,
        isArchived: !recipe.isArchived
      }));
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipe.id ? backendToFrontend(updated) : r
        )
      );
    } catch (e) {
      setError("Fehler beim Archivieren des Rezepts.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartBrew = async (recipe: Recipe) => {
    // Increment brew count in background
    try {
      const updated = await api.updateRecipe(Number(recipe.id), frontendToBackend({
        ...recipe,
        brewCount: (recipe.brewCount || 0) + 1
      }));
      // Update local state without waiting/blocking UI significantly
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipe.id ? backendToFrontend(updated) : r
        )
      );
      // Open brewing session with the *updated* recipe (so count is correct)
      setBrewingRecipe(backendToFrontend(updated));
    } catch (e) {
      console.error("Failed to increment brew count", e);
      // Still open brewing session even if count fails
      setBrewingRecipe(recipe);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteRecipe(Number(recipeId));
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
    } catch (e) {
      setError("Fehler beim Löschen des Rezepts.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4 flex items-center justify-center">
        <RecipeForm
          onSave={handleSaveRecipe}
          onCancel={handleCancelForm}
          initialRecipe={editingRecipe || undefined}
          initialMethod={category === "all" ? undefined : category}
        />
      </div>
    );
  }

  if (brewingRecipe) {
    return (
      <BrewingSession
        recipe={{...brewingRecipe, id: Number(brewingRecipe.id)}}
        onClose={() => setBrewingRecipe(null)}
        onUpdateRecipe={(id, data) => handleUpdateRecipe(id, data)}
        forcedMethod={category === "all" ? undefined : category}
      />
    );
  }

  const filteredRecipes = recipes.filter(
    (r) => {
      // Basic Search & Archive Filter
      const matchesSearch = r.beanName.toLowerCase().includes(search.toLowerCase());
      const matchesArchive = showArchived ? r.isArchived : !r.isArchived;

      // Category Filter
      let matchesCategory = true;
      if (category === "espresso") {
        matchesCategory = r.inputGrams > 0; // Assuming espresso entry exists if inputGrams > 0
      } else if (category === "filter") {
        matchesCategory = (r.filterInputGrams || 0) > 0; // Assuming filter entry
      }

      // Ratings Filter (apply to the active view context if possible, or general)
      // For now, check base ratings. Ideally, check filter ratings if category is filter.
      // But user might want to search globally. Let's keep it simple:
      // If category is filter, check filter ratings. If espresso, check espresso ratings.
      // If all, check either? NO, "All" usually implies just listing them.
      // Let's stick to: if category is filter, check filter_x. Else espresso_x.
      
      let matchesRating = true;
      if (category === "filter") {
         matchesRating = (filter.wertung === 0 || (r.filterTasteRating || 0) >= filter.wertung) &&
                         (filter.geschmacksnoten === 0 || (r.filterFlavorNotesRating || 0) >= filter.geschmacksnoten);
      } else {
         // Default to espresso ratings for "All" and "Espresso" for now, 
         // or strictly, "All" might check *either*?
         // Let's say for "All", we check the *primary* method's rating or just the espresso one. 
         // Consistently checking standard fields is safest for now unless we do complex OR logic.
         matchesRating = (filter.wertung === 0 || r.tasteRating >= filter.wertung) &&
                         (filter.geschmacksnoten === 0 || r.flavorNotesRating >= filter.geschmacksnoten);
      }
      
      return matchesSearch && matchesArchive && matchesCategory && matchesRating;
    }
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <Coffee className="h-6 w-6 text-coffee-medium" />
                  <h1 className="text-xl font-semibold text-foreground">
                    Espressolist
                  </h1>
                </div>

                {/* Category Toggle (Centered on desktop, full width on mobile) */}
                 <div className="flex p-1 bg-muted rounded-lg self-start sm:self-center">
                  <button
                    onClick={() => setCategory("espresso")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                      category === "espresso" 
                        ? "bg-white text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Espresso
                  </button>
                  <button
                    onClick={() => setCategory("filter")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                      category === "filter" 
                        ? "bg-white text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Filter
                  </button>
                  <button
                    onClick={() => setCategory("all")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                      category === "all" 
                        ? "bg-white text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    All
                  </button>
                </div>

                <div className="flex items-center">
                   <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowArchived(!showArchived)}
                    className={cn(
                      "text-xs h-7",
                      showArchived ? "bg-orange-100 text-orange-800" : "text-muted-foreground"
                    )}
                  >
                    {showArchived ? "Hide Archived" : "Show Archived"}
                  </Button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1">
                  <ExpandableSearchBar
                    onSearch={setSearch}
                    onFilterChange={setFilter}
                    onExpandChange={setSearchbarExpanded}
                  />
                </div>
                {// Nur auf kleinen Bildschirmen ausblenden
                !(
                  searchbarExpanded &&
                  typeof window !== "undefined" &&
                  window.matchMedia("(max-width: 1024px)").matches
                ) && (
                  <Button
                    onClick={() => setShowForm(true)}
                    className={cn(
                      "gap-2 shadow-soft",
                      "bg-gradient-coffee hover:opacity-90 text-primary-foreground"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    New Recipe
                  </Button>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <div className="text-center py-12">Lade...</div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <Coffee className="h-16 w-16 text-coffee-light mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Keine Rezepte gefunden
            </h2>
            <p className="text-muted-foreground mb-6">
              Passe deine Suche oder Filter an.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className={cn(
                "gap-2",
                "bg-gradient-coffee hover:opacity-90 text-primary-foreground"
              )}
            >
              <Plus className="h-4 w-4" />
              Neues Rezept
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleEditRecipe(recipe)}
                onDelete={handleDeleteRecipe}
                onArchive={handleArchiveRecipe}
                onStartBrew={() => handleStartBrew(recipe)}
                forcedMethod={category === "all" ? undefined : category}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
