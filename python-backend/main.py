from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3

app = FastAPI()

# CORS für das Frontend erlauben
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite DB Setup
DB_PATH = "./coffee.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Datenmodell
class Recipe(BaseModel):
    id: Optional[int] = None
    bean_name: str
    image: Optional[str] = None
    input_grams: float
    output_grams: float
    brewing_time: int
    grind_size: int
    taste_rating: int
    flavor_complexity: int

@app.on_event("startup")
def startup():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bean_name TEXT NOT NULL,
            image TEXT,
            input_grams REAL NOT NULL,
            output_grams REAL NOT NULL,
            brewing_time INTEGER NOT NULL,
            grind_size INTEGER NOT NULL,
            taste_rating INTEGER NOT NULL,
            flavor_complexity INTEGER NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()

@app.get("/api/recipes", response_model=List[Recipe])
def get_recipes():
    conn = get_db_connection()
    recipes = conn.execute("SELECT * FROM recipes").fetchall()
    conn.close()
    return [Recipe(**dict(row)) for row in recipes]

@app.post("/api/recipes", response_model=Recipe)
def create_recipe(recipe: Recipe):
    conn = get_db_connection()
    cur = conn.execute(
        """
        INSERT INTO recipes (bean_name, image, input_grams, output_grams, brewing_time, grind_size, taste_rating, flavor_complexity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            recipe.bean_name,
            recipe.image,
            recipe.input_grams,
            recipe.output_grams,
            recipe.brewing_time,
            recipe.grind_size,
            recipe.taste_rating,
            recipe.flavor_complexity,
        ),
    )
    conn.commit()
    recipe.id = cur.lastrowid
    conn.close()
    return recipe

@app.delete("/api/recipes/{recipe_id}")
def delete_recipe(recipe_id: int):
    conn = get_db_connection()
    cur = conn.execute("DELETE FROM recipes WHERE id = ?", (recipe_id,))
    conn.commit()
    deleted = cur.rowcount
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {"deleted": deleted}

# --- PUT-Endpoint zum Aktualisieren eines Rezepts ---
@app.put("/api/recipes/{recipe_id}", response_model=Recipe)
def update_recipe(recipe_id: int, recipe: Recipe):
    conn = get_db_connection()
    cur = conn.execute(
        """
        UPDATE recipes SET
            bean_name = ?,
            image = ?,
            input_grams = ?,
            output_grams = ?,
            brewing_time = ?,
            grind_size = ?,
            taste_rating = ?,
            flavor_complexity = ?
        WHERE id = ?
        """,
        (
            recipe.bean_name,
            recipe.image,
            recipe.input_grams,
            recipe.output_grams,
            recipe.brewing_time,
            recipe.grind_size,
            recipe.taste_rating,
            recipe.flavor_complexity,
            recipe_id,
        ),
    )
    conn.commit()
    updated = cur.rowcount
    conn.close()
    if updated == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {**recipe.dict(), "id": recipe_id}