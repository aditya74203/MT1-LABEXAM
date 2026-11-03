// expressApp.js - Part B: Library Management REST API Using Express.js
// MT1-LABEXAM: Library Book Management Web Application

import express from 'express';

// ─────────────────────────────────────────────
// B1. Configure Express.js
// ─────────────────────────────────────────────
const app  = express();
const PORT = 4000;

// B1. Configure JSON parsing middleware
app.use(express.json());

// ─────────────────────────────────────────────
// B1 & B3. Initialize sample book records array
// ─────────────────────────────────────────────
let books = [
  { id: 1, title: 'The Alchemist',  author: 'Paulo Coelho',     price: 350, category: 'Fiction'     },
  { id: 2, title: 'Atomic Habits',  author: 'James Clear',      price: 499, category: 'Self-Help'   },
  { id: 3, title: 'Clean Code',     author: 'Robert C. Martin', price: 550, category: 'Programming' },
];

// ─────────────────────────────────────────────
// B2. CRUD Operations
// ─────────────────────────────────────────────

// GET /books  →  Retrieve all books
app.get('/books', (req, res) => {
  res.status(200).json({
    success : true,
    count   : books.length,
    books,
  });
});

// GET /books/:id  →  Retrieve a book by ID
app.get('/books/:id', (req, res) => {
  const id   = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  // B4. Return 404 when book not found
  if (!book) {
    return res.status(404).json({
      success : false,
      error   : `Book with id ${id} not found`,
    });
  }

  res.status(200).json({ success: true, book });
});

// POST /books  →  Add a new book
// B4. Return 201 when book is successfully created
app.post('/books', (req, res) => {
  const { id, title, author, price, category } = req.body;

  // B4. Validate required fields
  if (!id || !title || !author || !price || !category) {
    return res.status(400).json({
      success : false,
      error   : 'Missing required fields: id, title, author, price, category',
    });
  }

  // Check duplicate id
  if (books.find((b) => b.id === id)) {
    return res.status(409).json({
      success : false,
      error   : `Book with id ${id} already exists`,
    });
  }

  const newBook = { id, title, author, price, category };
  books.push(newBook);

  // B4. Return 201 for successful creation
  res.status(201).json({
    message : 'Book added successfully',
    book    : newBook,
  });
});

// PUT /books/:id  →  Update book details
app.put('/books/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  // B4. Return 404 when book not found
  if (index === -1) {
    return res.status(404).json({
      success : false,
      error   : `Book with id ${id} not found`,
    });
  }

  const updatedBook = { ...books[index], ...req.body, id };
  books[index] = updatedBook;

  res.status(200).json({
    success : true,
    message : 'Book updated successfully',
    book    : updatedBook,
  });
});

// DELETE /books/:id  →  Delete a book
app.delete('/books/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  // B4. Return 404 when book not found
  if (index === -1) {
    return res.status(404).json({
      success : false,
      error   : `Book with id ${id} not found`,
    });
  }

  const deletedBook = books.splice(index, 1)[0];

  res.status(200).json({
    success : true,
    message : 'Book deleted successfully',
    book    : deletedBook,
  });
});

// ─────────────────────────────────────────────
// B4. Handle invalid / unmatched routes
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success : false,
    error   : `Route '${req.originalUrl}' not found`,
    hint    : 'Valid endpoints: GET/POST /books, GET/PUT/DELETE /books/:id',
  });
});

// ─────────────────────────────────────────────
// B1. Listen on port 4000
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET    http://localhost:${PORT}/books`);
  console.log(`  GET    http://localhost:${PORT}/books/:id`);
  console.log(`  POST   http://localhost:${PORT}/books`);
  console.log(`  PUT    http://localhost:${PORT}/books/:id`);
  console.log(`  DELETE http://localhost:${PORT}/books/:id`);
});
