import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// SQLite DB setup
const db = new sqlite3.Database("./coffee.db", (err) => {
  if (err) {
    console.error("DB-Fehler:", err.message);
  } else {
    console.log("SQLite DB verbunden.");
    db.run(`CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      rating INTEGER
    )`);
  }
});

// API: Alle Rezepte
app.get("/api/recipes", (req, res) => {
  db.all("SELECT * FROM recipes", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Rezept anlegen
app.post("/api/recipes", (req, res) => {
  const { name, description, rating } = req.body;
  db.run(
    "INSERT INTO recipes (name, description, rating) VALUES (?, ?, ?)",
    [name, description, rating],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, description, rating });
    }
  );
});

// API: Rezept löschen
app.delete("/api/recipes/:id", (req, res) => {
  db.run(
    "DELETE FROM recipes WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
    }
  );
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
