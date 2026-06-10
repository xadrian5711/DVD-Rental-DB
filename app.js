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
  } catch (error) {}
});

app.get("/", (req, res) => {
  res.status(404).redirect("/");
});

app.listen(port, () => {
  console.log(`DVD Store demo running on http://localhost:${port}`);
  console.log(`Using Database ${DB_URL}`);
});
