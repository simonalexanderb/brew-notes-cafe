import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeForm } from "@/components/RecipeForm";
import { Plus, Coffee } from "lucide-react";
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
  };
}

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-coffee-medium" />
              <h1 className="text-xl font-semibold text-foreground">
                Espressolist
              </h1>
            </div>
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
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <div className="text-center py-12">Lade...</div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <Coffee className="h-16 w-16 text-coffee-light mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No recipes yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start by creating your first espresso recipe
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className={cn(
                "gap-2",
                "bg-gradient-coffee hover:opacity-90 text-primary-foreground"
              )}
            >
              <Plus className="h-4 w-4" />
              Create First Recipe
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleEditRecipe(recipe)}
                onDelete={() => handleDeleteRecipe(recipe.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
