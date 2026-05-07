const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./library.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      year INTEGER,
      stock INTEGER
    )
  `);
});

app.get("/books", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});

app.post("/books", (req, res) => {
  const { title, author, year, stock } = req.body;

  db.run(
    `
    INSERT INTO books(title, author, year, stock)
    VALUES (?, ?, ?, ?)
    `,
    [title, author, year, stock],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        id: this.lastID,
        title,
        author,
        year,
        stock,
      });
    }
  );
});
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM books WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: "Book deleted",
    });
  });
});
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, year, stock } = req.body;

  db.run(
    `
    UPDATE books
    SET title = ?, author = ?, year = ?, stock = ?
    WHERE id = ?
    `,
    [title, author, year, stock, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: "Book updated",
      });
    }
  );
});
app.listen(3001, () => {
  console.log("Server running on port 3001");
});