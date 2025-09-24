import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeForm } from "@/components/RecipeForm";
import { Plus, Coffee } from "lucide-react";
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

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Load recipes from localStorage on mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem('espresso-recipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
  }, []);

  // Save recipes to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem('espresso-recipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleSaveRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    if (editingRecipe) {
      // Update existing recipe
      setRecipes(prev => prev.map(recipe => 
        recipe.id === editingRecipe.id 
          ? { ...recipeData, id: editingRecipe.id }
          : recipe
      ));
      setEditingRecipe(null);
    } else {
      // Add new recipe
      const newRecipe: Recipe = {
        ...recipeData,
        id: Date.now().toString()
      };
      setRecipes(prev => [newRecipe, ...prev]);
    }
    setShowForm(false);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
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
                Espresso Recipes
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
        {recipes.length === 0 ? (
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
