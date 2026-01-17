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
    # New fields for Aroma Radar & Tags
    fragrance: Optional[float] = 0
    aroma: Optional[float] = 0
    flavor: Optional[float] = 0
    sweetness: Optional[float] = 0
    acidity: Optional[float] = 0
    body: Optional[float] = 0
    aftertaste: Optional[float] = 0
    balance: Optional[float] = 0
    aroma_tags: Optional[str] = ""  # JSON or comma-separated string
    # New fields for Features (Archive, Brew Count, Filter)
    is_archived: bool = False
    brew_count: int = 0
    brew_method: str = "espresso"
    filter_input_grams: float = 0
    filter_water_grams: float = 0
    filter_brewing_temperature: float = 0
    filter_blooming_time: int = 0
    filter_brewing_time: int = 0
    filter_grind_size: int = 0
    # Filter specific flavor fields
    filter_taste_rating: Optional[int] = 0
    filter_flavor_complexity: Optional[int] = 0
    filter_fragrance: Optional[float] = 0
    filter_aroma: Optional[float] = 0
    filter_flavor: Optional[float] = 0
    filter_sweetness: Optional[float] = 0
    filter_acidity: Optional[float] = 0
    filter_body: Optional[float] = 0
    filter_aftertaste: Optional[float] = 0
    filter_balance: Optional[float] = 0
    filter_aroma_tags: Optional[str] = ""

@app.on_event("startup")
def startup():
    conn = get_db_connection()
    
    # Create table if not exists - Updated with new columns
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
            flavor_complexity INTEGER NOT NULL,
            fragrance REAL DEFAULT 0,
            aroma REAL DEFAULT 0,
            flavor REAL DEFAULT 0,
            sweetness REAL DEFAULT 0,
            acidity REAL DEFAULT 0,
            body REAL DEFAULT 0,
            aftertaste REAL DEFAULT 0,
            balance REAL DEFAULT 0,
            aroma_tags TEXT DEFAULT '',
            is_archived INTEGER DEFAULT 0,
            brew_count INTEGER DEFAULT 0,
            brew_method TEXT DEFAULT 'espresso',
            filter_input_grams REAL DEFAULT 0,
            filter_water_grams REAL DEFAULT 0,
            filter_brewing_temperature REAL DEFAULT 0,
            filter_blooming_time INTEGER DEFAULT 0,
            filter_brewing_time INTEGER DEFAULT 0,
            filter_grind_size INTEGER DEFAULT 0,
            filter_taste_rating INTEGER DEFAULT 0,
            filter_flavor_complexity INTEGER DEFAULT 0,
            filter_fragrance REAL DEFAULT 0,
            filter_aroma REAL DEFAULT 0,
            filter_flavor REAL DEFAULT 0,
            filter_sweetness REAL DEFAULT 0,
            filter_acidity REAL DEFAULT 0,
            filter_body REAL DEFAULT 0,
            filter_aftertaste REAL DEFAULT 0,
            filter_balance REAL DEFAULT 0,
            filter_aroma_tags TEXT DEFAULT ''
        )
        """
    )
    
    # Migration: Add new columns if they don't exist (for existing DBs)
    cursor = conn.execute("PRAGMA table_info(recipes)")
    columns = [info[1] for info in cursor.fetchall()]
    
    new_columns = {
        "fragrance": "REAL DEFAULT 0",
        "aroma": "REAL DEFAULT 0",
        "flavor": "REAL DEFAULT 0",
        "sweetness": "REAL DEFAULT 0",
        "acidity": "REAL DEFAULT 0",
        "body": "REAL DEFAULT 0",
        "aftertaste": "REAL DEFAULT 0",
        "balance": "REAL DEFAULT 0",
        "aroma_tags": "TEXT DEFAULT ''",
        "is_archived": "INTEGER DEFAULT 0",
        "brew_count": "INTEGER DEFAULT 0",
        "brew_method": "TEXT DEFAULT 'espresso'",
        "filter_input_grams": "REAL DEFAULT 0",
        "filter_water_grams": "REAL DEFAULT 0",
        "filter_brewing_temperature": "REAL DEFAULT 0",
        "filter_blooming_time": "INTEGER DEFAULT 0",
        "filter_brewing_time": "INTEGER DEFAULT 0",
        "filter_grind_size": "INTEGER DEFAULT 0",
        "filter_taste_rating": "INTEGER DEFAULT 0",
        "filter_flavor_complexity": "INTEGER DEFAULT 0",
        "filter_fragrance": "REAL DEFAULT 0",
        "filter_aroma": "REAL DEFAULT 0",
        "filter_flavor": "REAL DEFAULT 0",
        "filter_sweetness": "REAL DEFAULT 0",
        "filter_acidity": "REAL DEFAULT 0",
        "filter_body": "REAL DEFAULT 0",
        "filter_aftertaste": "REAL DEFAULT 0",
        "filter_balance": "REAL DEFAULT 0",
        "filter_aroma_tags": "TEXT DEFAULT ''"
    }
    
    for col, dtype in new_columns.items():
        if col not in columns:
            print(f"Migrating DB: Adding column {col}")
            conn.execute(f"ALTER TABLE recipes ADD COLUMN {col} {dtype}")
            
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
        INSERT INTO recipes (
            bean_name, image, input_grams, output_grams, brewing_time, grind_size, 
            taste_rating, flavor_complexity,
            fragrance, aroma, flavor, sweetness, acidity, body, aftertaste, balance, aroma_tags,
            is_archived, brew_count, brew_method,
            filter_input_grams, filter_water_grams, filter_brewing_temperature, 
            filter_blooming_time, filter_brewing_time, filter_grind_size,
            filter_taste_rating, filter_flavor_complexity,
            filter_fragrance, filter_aroma, filter_flavor, filter_sweetness, 
            filter_acidity, filter_body, filter_aftertaste, filter_balance, filter_aroma_tags
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            recipe.bean_name, recipe.image, recipe.input_grams, recipe.output_grams, 
            recipe.brewing_time, recipe.grind_size, recipe.taste_rating, recipe.flavor_complexity,
            recipe.fragrance, recipe.aroma, recipe.flavor, recipe.sweetness, 
            recipe.acidity, recipe.body, recipe.aftertaste, recipe.balance, recipe.aroma_tags,
            recipe.is_archived, recipe.brew_count, recipe.brew_method,
            recipe.filter_input_grams, recipe.filter_water_grams, recipe.filter_brewing_temperature,
            recipe.filter_blooming_time, recipe.filter_brewing_time, recipe.filter_grind_size,
            recipe.filter_taste_rating, recipe.filter_flavor_complexity,
            recipe.filter_fragrance, recipe.filter_aroma, recipe.filter_flavor, recipe.filter_sweetness,
            recipe.filter_acidity, recipe.filter_body, recipe.filter_aftertaste, recipe.filter_balance,
            recipe.filter_aroma_tags
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
            flavor_complexity = ?,
            fragrance = ?,
            aroma = ?,
            flavor = ?,
            sweetness = ?,
            acidity = ?,
            body = ?,
            aftertaste = ?,
            balance = ?,
            aroma_tags = ?,
            is_archived = ?,
            brew_count = ?,
            brew_method = ?,
            filter_input_grams = ?,
            filter_water_grams = ?,
            filter_brewing_temperature = ?,
            filter_blooming_time = ?,
            filter_brewing_time = ?,
            filter_grind_size = ?,
            filter_taste_rating = ?,
            filter_flavor_complexity = ?,
            filter_fragrance = ?,
            filter_aroma = ?,
            filter_flavor = ?,
            filter_sweetness = ?,
            filter_acidity = ?,
            filter_body = ?,
            filter_aftertaste = ?,
            filter_balance = ?,
            filter_aroma_tags = ?
        WHERE id = ?
        """,
        (
            recipe.bean_name, recipe.image, recipe.input_grams, recipe.output_grams, 
            recipe.brewing_time, recipe.grind_size, recipe.taste_rating, recipe.flavor_complexity,
            recipe.fragrance, recipe.aroma, recipe.flavor, recipe.sweetness, 
            recipe.acidity, recipe.body, recipe.aftertaste, recipe.balance, recipe.aroma_tags,
            recipe.is_archived, recipe.brew_count, recipe.brew_method,
            recipe.filter_input_grams, recipe.filter_water_grams, recipe.filter_brewing_temperature,
            recipe.filter_blooming_time, recipe.filter_brewing_time, recipe.filter_grind_size,
            recipe.filter_taste_rating, recipe.filter_flavor_complexity,
            recipe.filter_fragrance, recipe.filter_aroma, recipe.filter_flavor, recipe.filter_sweetness,
            recipe.filter_acidity, recipe.filter_body, recipe.filter_aftertaste, recipe.filter_balance,
            recipe.filter_aroma_tags,
            recipe_id,
        ),
    )
    conn.commit()
    updated = cur.rowcount
    conn.close()
    if updated == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {**recipe.dict(), "id": recipe_id}