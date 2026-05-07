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

  const [editingId, setEditingId] = useState<number | null>(null);

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

    resetForm();
    fetchBooks();
  };

  const startEdit = (book: Book) => {
    setEditingId(book.id);

    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year.toString());
    setStock(book.stock.toString());
  };

  const updateBook = async () => {
    await axios.put(`http://localhost:3001/books/${editingId}`, {
      title,
      author,
      year: Number(year),
      stock: Number(stock),
    });

    setEditingId(null);

    resetForm();
    fetchBooks();
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setYear("");
    setStock("");
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "white",
        backgroundColor: "#020617",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "5rem",
          marginBottom: "2rem",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Library Manager
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={editingId ? updateBook : addBook}
          style={mainButtonStyle}
        >
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.2rem",
        }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid #334155",
              borderRadius: "18px",
              padding: "1.2rem",
              background: "#0f172a",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "2rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {book.title}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  textAlign: "center",
                  color: "#cbd5e1",
                  fontSize: "1rem",
                }}
              >
                <p>
                  <strong>Author:</strong> {book.author}
                </p>

                <p>
                  <strong>Year:</strong> {book.year}
                </p>

                <p>
                  <strong>Stock:</strong> {book.stock}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.8rem",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={() => startEdit(book)}
                style={secondaryButtonStyle}
              >
                Edit
              </button>

              <button
                onClick={async () => {
                  await axios.delete(
                    `http://localhost:3001/books/${book.id}`
                  );

                  fetchBooks();
                }}
                style={deleteButtonStyle}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "1rem",
  borderRadius: "12px",
  border: "1px solid #334155",
  backgroundColor: "#1e293b",
  color: "white",
  fontSize: "1rem",
  outline: "none",
};

const mainButtonStyle = {
  padding: "1rem",
  borderRadius: "12px",
  border: "none",
  background:
    "linear-gradient(to right, rgb(99, 102, 241), rgb(129, 140, 248))",
  color: "white",
  fontSize: "1rem",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle = {
  flex: 1,
  padding: "0.7rem",
  borderRadius: "10px",
  border: "none",
  background: "#334155",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const deleteButtonStyle = {
  flex: 1,
  padding: "0.7rem",
  borderRadius: "10px",
  border: "1px solid #475569",
  background: "#1e293b",
  color: "#cbd5e1",
  cursor: "pointer",
  fontWeight: "bold",
};

export default App;