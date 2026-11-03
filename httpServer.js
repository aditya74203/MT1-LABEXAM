// httpServer.js - Part A: HTTP Module and Server Creation
// MT1-LABEXAM: Library Book Management Web Application

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────
// A1. In-memory book records (JavaScript Array)
// ─────────────────────────────────────────────
let books = [
  { id: 1, title: 'The Alchemist',     author: 'Paulo Coelho',    price: 350 },
  { id: 2, title: 'Atomic Habits',     author: 'James Clear',     price: 499 },
  { id: 3, title: 'Clean Code',        author: 'Robert C. Martin', price: 550 },
];

// ─────────────────────────────────────────────
// Helper: Read request body (for POST)
// ─────────────────────────────────────────────
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end',  () => {
      try   { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

// ─────────────────────────────────────────────
// A1. Create HTTP Server
// ─────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // ── A2 & A3: Routing + HTTP Method Handling ──────────────────────────────

  // GET  /  →  Welcome message in HTML
  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Library Book Management</title>
        <style>
          body { font-family: Arial, sans-serif; background: #1a1a2e; color: #eee;
                 display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #16213e; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,.4); }
          h1 { color: #e94560; margin-bottom: 8px; }
          p  { color: #a8b2d8; }
          ul { list-style: none; padding: 0; margin-top: 20px; }
          li { margin: 8px 0; }
          a  { color: #0f3460; background: #e94560; padding: 6px 18px; border-radius: 20px;
               text-decoration: none; font-weight: bold; }
          a:hover { background: #c73652; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>📚 Library Book Management</h1>
          <p>Welcome to the Library Book Management HTTP Server</p>
          <p>Running on <strong>Port 3000</strong></p>
          <ul>
            <li><a href="/books">/books</a> – View all books (JSON)</li>
            <li><a href="/about">/about</a> – About this application</li>
            <li><a href="/home">/home</a>  – Home page (HTML via FS)</li>
          </ul>
        </div>
      </body>
      </html>
    `);
    return;
  }

  // GET  /books  →  List of books in JSON
  if (method === 'GET' && url === '/books') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: books.length, books }, null, 2));
    return;
  }

  // GET  /about  →  Library application information
  if (method === 'GET' && url === '/about') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      application : 'Library Book Management Web Application',
      version     : '1.0.0',
      technology  : ['Node.js', 'HTTP Module', 'FS Module', 'Express.js'],
      description : 'A full-stack library management system built for MT1 Lab Examination',
      author      : 'aditya74203',
      ports       : { httpServer: 3000, expressApp: 4000 },
    }, null, 2));
    return;
  }

  // GET  /home  →  A4. Serve HTML file using FS Module
  if (method === 'GET' && url === '/home') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    // A4. Read index.html using fs module
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        // A5. Handle file-reading errors
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read index.html', details: err.message }));
        return;
      }
      // A4. Set appropriate Content-Type header
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // POST  /add-book  →  A3. Accept book details, add to array
  if (method === 'POST' && url === '/add-book') {
    try {
      const body = await readBody(req);
      const { id, title, author, price } = body;

      // A5. Validate required book fields
      if (!id || !title || !author || !price) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success : false,
          error   : 'Missing required fields: id, title, author, price',
        }));
        return;
      }

      // Check for duplicate id
      if (books.find((b) => b.id === id)) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: `Book with id ${id} already exists` }));
        return;
      }

      const newBook = { id, title, author, price };
      books.push(newBook);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Book added successfully', book: newBook }, null, 2));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // A5. 404 for all invalid / unhandled routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success : false,
    error   : `Route '${url}' not found`,
    hint    : 'Valid routes: /, /books, /about, /home, POST /add-book',
  }));
});

// ─────────────────────────────────────────────
// A1. Listen on port 3000
// ─────────────────────────────────────────────
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/books`);
  console.log(`  GET  http://localhost:${PORT}/about`);
  console.log(`  GET  http://localhost:${PORT}/home`);
  console.log(`  POST http://localhost:${PORT}/add-book`);
});
