# React + Vite

Documents **Todo App with User Authentication**, integrating both frontend and backend parts:

```markdown
# 📝 Full-Stack Todo App with User Authentication (React + Node.js + MongoDB)

This is a full-featured Todo List application with user login, task tagging, priorities, mentions, filtering, sorting, notes, and data export capabilities.

## 🚀 Features

### ✅ User Authentication
- Login via email/password
- Token-based auth (JWT)
- Session-based access to todos

### 🗂️ Todos
- Add / Edit / Delete todos
- Add notes to each todo
- Mention users with `@username`
- Filter by priority, tag, or username
- Sort by creation date or priority
- Pagination (5 todos per page)

### Filter and sorting Feature
- Tag support: `work`, `personal`, `professional`
- Priority levels: `High`, `Medium`, `Low`

### 🛠️ Export
- Export todos to `.json` and `.csv` format

---

## 🧱 Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React + Axios 
| Backend    | Node.js + Express             |
| Auth       | JWT-based token auth          |
| Database   | MongoDB (via Mongoose)        |

---

## 📁 Folder Structure

```

📦 TODOAPP_MORROW
├
│   ├── TodoApp.js
│   ├── api/
│   │   └── axios.js
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Todo.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── todoController.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── todo.routes.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js

```

---

## 🔧 Backend Setup

### 1. Environment Variables

Create a `.env` file:

```

PORT=5000
JWT\_SECRET=your\_jwt\_secret\_key
MONGO\_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tododb

````

### 2. Install Dependencies

```bash
cd backend
npm install
````

### 3. Run Server

```bash
node server.js
```

---


## 🌐 Frontend Setup


### 2. Configure Axios

In `api/axios.js`:


### 3. Run React App

```bash
npm run dev
```

---

## 🛠️ API Endpoints

### 🔐 Auth

| Method | Route            | Description          |
| ------ | ---------------- | -------------------- |
| POST   | `/auth/register` | Register new user    |
| POST   | `/auth/login`    | Login, returns token |

### 📝 Todos (Protected)

| Method | Route              | Description          |
| ------ | ------------------ | -------------------- |
| GET    | `/todos`           | Fetch all user todos |
| POST   | `/todos`           | Add new todo         |
| PUT    | `/todos/:id`       | Update a todo        |
| DELETE | `/todos/:id`       | Delete a todo        |
| POST   | `/todos/:id/notes` | Add note to a todo   |

> All `/todos` routes require an `Authorization: Bearer <token>` header.

---

## 🔐 Authentication Flow

1. **Login**

   * POST `/auth/login` with email/password
   * Store returned JWT in `localStorage`
2. **Authenticated Requests**

   * Include token in header: `Authorization: Bearer <token>`
3. **Logout**

   * Remove token from `localStorage`

---

## 📷 Screenshots



---

## 👨‍💻 Author

Built with ❤️ by ANUJ

---
