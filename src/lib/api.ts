export async function updateRecipe(id: number, recipe: Omit<Recipe, "id">): Promise<Recipe> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });
  if (!res.ok) throw new Error("Fehler beim Aktualisieren des Rezepts");
  return res.json();
}
// API-Client für das FastAPI-Backend
export interface Recipe {
  id?: number;
  bean_name: string;
  image?: string;
  input_grams: number;
  output_grams: number;
  brewing_time: number;
  grind_size: number;
  taste_rating: number;
  flavor_complexity: number;
}

const API_URL = "/api/recipes";

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Fehler beim Laden der Rezepte");
  return res.json();
}

export async function createRecipe(recipe: Omit<Recipe, "id">): Promise<Recipe> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });
  if (!res.ok) throw new Error("Fehler beim Anlegen des Rezepts");
  return res.json();
}

export async function deleteRecipe(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Fehler beim Löschen des Rezepts");
}
