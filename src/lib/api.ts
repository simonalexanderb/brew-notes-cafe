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
  // New fields for Aroma Radar & Tags
  fragrance?: number;
  aroma?: number;
  flavor?: number;
  sweetness?: number;
  acidity?: number;
  body?: number;
  aftertaste?: number;
  balance?: number;
  aroma_tags?: string; // JSON or comma-separated string
  // New features
  is_archived?: boolean;
  brew_count?: number;
  brew_method?: string;
  // Filter specific fields
  filter_input_grams?: number;
  filter_water_grams?: number;
  filter_brewing_temperature?: number;
  filter_blooming_time?: number;
  filter_brewing_time?: number;
  filter_grind_size?: number;
  filter_taste_rating?: number;
  filter_flavor_complexity?: number;
  filter_fragrance?: number;
  filter_aroma?: number;
  filter_flavor?: number;
  filter_sweetness?: number;
  filter_acidity?: number;
  filter_body?: number;
  filter_aftertaste?: number;
  filter_balance?: number;
  filter_aroma_tags?: string;
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
