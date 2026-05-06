import { useEffect, useState } from "react";
import axios from "axios";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  stock: number;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await axios.get("http://localhost:3001/books");
    setBooks(response.data);
  };

  const addBook = async () => {
    if (!title || !author || !year || !stock) return;

    await axios.post("http://localhost:3001/books", {
      title,
      author,
      year: Number(year),
      stock: Number(stock),
    });

    setTitle("");
    setAuthor("");
    setYear("");
    setStock("");

    fetchBooks();
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>📚 Library Manager</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button onClick={addBook}>Add Book</button>
      </div>

      <div>
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid gray",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2>{book.title}</h2>
            <p>Author: {book.author}</p>
            <p>Year: {book.year}</p>
            <p>Stock: {book.stock}</p>
            <button
  onClick={async () => {
    await axios.delete(`http://localhost:3001/books/${book.id}`);
    fetchBooks();
  }}
>
  Delete
</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;