// Updated TodoApp.js with separate login/register pages and JWT expiry auto-logout
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import API from '../api/axios.js';

const LoginPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('expiry', Date.now() + 3600000); // 1 hour expiry
      setCurrentUser(res.data.user.name);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={loginHandler}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Login</button>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </form>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password });
      alert('Registered successfully. Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={registerHandler}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Register</button>
      <p>Already have an account? <a href="/">Login</a></p>
    </form>
  );
};

const Dashboard = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tag, setTag] = useState('work');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;
  const predefinedTags = ['work', 'personal', 'professional'];

  const fetchTodos = async () => {
    try {
      const res = await API.get('/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to load todos', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem('expiry');
      if (expiry && Date.now() > Number(expiry)) {
        localStorage.removeItem('token');
        localStorage.removeItem('expiry');
        setCurrentUser('');
        alert('Session expired. Please log in again.');
        navigate('/');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!title || !description) return;
    const mentionedUsers = description.match(/@\w+/g)?.map(u => u.slice(1)) || [];
    const todo = { title, description, priority, tag, mentionedUsers };
    try {
      if (editId) await API.put(`/todos/${editId}`, todo);
      else await API.post('/todos', todo);
      setTitle(''); setDescription(''); setPriority('Medium'); setTag('work'); setEditId(null);
      fetchTodos();
    } catch (err) {
      console.error('Failed to save todo', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    setCurrentUser('');
    navigate('/');
  };

  const filtered = todos.filter(todo => todo.user === currentUser);
  const currentTodos = filtered.slice((currentPage - 1) * todosPerPage, currentPage * todosPerPage);
  const totalPages = Math.ceil(filtered.length / todosPerPage);

  return (
    <div>
      <h2>Todo App (User: {currentUser})</h2>
      <button onClick={logoutHandler}>Logout</button>
      <input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        {predefinedTags.map(t => <option key={t}>{t}</option>)}
      </select>
      <button onClick={handleSubmit}>{editId ? 'Update' : 'Add'} Todo</button>
      <table border={1}>
        <thead><tr><th>#</th><th>Title</th><th>Description</th><th>Priority</th><th>Tag</th><th>Actions</th></tr></thead>
        <tbody>
          {currentTodos.map((todo, index) => (
            <tr key={todo._id}>
              <td>{(currentPage - 1) * todosPerPage + index + 1}</td>
              <td>{todo.title}</td>
              <td>{todo.description}</td>
              <td>{todo.priority}</td>
              <td>{todo.tag}</td>
              <td>
                <button onClick={() => { setTitle(todo.title); setDescription(todo.description); setPriority(todo.priority); setTag(todo.tag); setEditId(todo._id); }}>Edit</button>
                <button onClick={() => handleDelete(todo._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
};

const TodoApp = () => {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('token') ? '...' : '');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={localStorage.getItem('token') ? <Dashboard currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default TodoApp;
