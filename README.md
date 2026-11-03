# MT1-LABEXAM – Library Book Management Web Application

> **Subject:** Full Stack Development – Node.js Lab Examination  
> **GitHub ID:** aditya74203  
> **Technology:** Node.js · HTTP Module · FS Module · Express.js  
> **Database:** None (JavaScript Array)

---

## 📁 Project Structure

```
MT1-LABEXAM/
├── package.json        ← ES Module config + dependencies
├── httpServer.js       ← Part A: HTTP Module server (Port 3000)
├── expressApp.js       ← Part B: Express.js REST API (Port 4000)
├── public/
│   └── index.html      ← Static HTML served via FS Module
└── screenshots/        ← Add your test screenshots here
```

---

## 🚀 Getting Started

### Install dependencies
```bash
npm install
```

### Start HTTP Server (Part A — Port 3000)
```bash
node httpServer.js
```

### Start Express Server (Part B — Port 4000)
```bash
node expressApp.js
```

---

## 🔌 API Endpoints

### Part A — HTTP Server (Port 3000)

| Method | Route       | Description                        |
|--------|-------------|------------------------------------|
| GET    | `/`         | Welcome message (HTML)             |
| GET    | `/books`    | All books (JSON)                   |
| GET    | `/about`    | Application info (JSON)            |
| GET    | `/home`     | Serves `index.html` via FS Module  |
| POST   | `/add-book` | Add a book (`id, title, author, price`) |

### Part B — Express REST API (Port 4000)

| Method | Route         | Status | Description            |
|--------|---------------|--------|------------------------|
| GET    | `/books`      | 200    | Retrieve all books     |
| GET    | `/books/:id`  | 200/404| Retrieve book by ID    |
| POST   | `/books`      | 201    | Add a new book         |
| PUT    | `/books/:id`  | 200/404| Update book details    |
| DELETE | `/books/:id`  | 200/404| Delete a book          |

---

## 📦 Sample Book Object

```json
{
  "id": 1,
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "price": 350,
  "category": "Fiction"
}
```

---

## 🧪 Sample POST Request

**URL:** `http://localhost:4000/books`  
**Body (raw JSON):**
```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "category": "Programming"
}
```

**Expected Response (201):**
```json
{
  "message": "Book added successfully",
  "book": {
    "id": 4,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "price": 550,
    "category": "Programming"
  }
}
```

---

## 📌 Notes

- Both servers run **independently** on different ports.
- No database used — data is stored in JavaScript arrays.
- ES Modules (`"type": "module"`) used throughout.
- Proper HTTP status codes returned for all responses.
