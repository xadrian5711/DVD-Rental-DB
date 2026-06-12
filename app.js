import express from "express";
import { Pool } from "pg";
import path from "path";

const DB_URL = process.env.DATABASE_URL || "postgresql://postgres";
const pool = new Pool({ connectionString: DB_URL });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/films", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT film_id, title, description. release_year, rental_rate
            FROM film
            ORDER BY title ASC
            LIMIT 10`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error cannot find films");
  }
});

app.put("/api/film/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, release_year } = req.body;

  if (!title) {
    return res.status(400).json({ error: `Title is required.` });
  }
  try {
    const result = await pool.query(
      ` UPDATE film
            SET title = $1, description = $2, release_year = $3
            WHERE film_id, title, description, release_year, rental_rate`,
      [title, description || "", release_year || null, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Filf with ID ${id} not found.:/` });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating film`, error);
    res.status(500).json({ error: `Internal server error.` });
  }
});

app.get("/", (req, res) => {
  res.status(404).redirect("/");
});

app.listen(port, () => {
  console.log(`DVD Store demo running on http://localhost:${port}`);
  console.log(`Using Database ${DB_URL}`);
});
