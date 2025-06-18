import React, { useState } from 'react';

const TodoApp = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tag, setTag] = useState('work');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  const [filterPriority, setFilterPriority] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [currentUser, setCurrentUser] = useState('alice');
  const [sortBy, setSortBy] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const predefinedUsers = ['alice', 'bob', 'john', 'sara', 'admin'];
  const predefinedTags = ['work', 'personal', 'professional'];

  const handleSubmit = () => {
    if (!title || !description) return;

    const mentionedUsers = description
      .split(/\s+/)
      .filter(word => word.startsWith('@'))
      .map(word => word.slice(1))
      .filter(u => predefinedUsers.includes(u.toLowerCase()));

    const todo = {
      id: editId || Date.now(),
      title,
      description,
      priority,
      user: currentUser,
      tag,
      mentionedUsers,
      notes: editId ? todos.find(t => t.id === editId).notes : [],
    };

    setTodos(prev => {
      if (editId) {
        return prev.map(t => (t.id === editId ? todo : t));
      } else {
        return [...prev, todo];
      }
    });

    setTitle('');
    setDescription('');
    setPriority('Medium');
    setTag('work');
    setEditId(null);
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setPriority(todo.priority);
    setTag(todo.tag);
    setEditId(todo.id);
  };

  const handleDelete = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const openNotesModal = (id) => {
    setActiveTodoId(id);
    setShowNotesModal(true);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setTodos(prev => prev.map(todo =>
      todo.id === activeTodoId
        ? { ...todo, notes: [...(todo.notes || []), { text: noteText, date: new Date() }] }
        : todo
    ));
    setNoteText('');
  };

  const exportJSON = () => {
    const jsonData = JSON.stringify(todos.filter(todo => todo.user === currentUser), null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'todos.json';
    link.click();
  };

  const exportCSV = () => {
    const headers = ['Title', 'Description', 'Priority', 'User', 'Tag'];
    const rows = todos.filter(todo => todo.user === currentUser).map(todo => [todo.title, todo.description, todo.priority, todo.user, todo.tag].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'todos.csv';
    link.click();
  };

  let filtered = todos.filter(todo => todo.user === currentUser);
  if (filterPriority) filtered = filtered.filter(todo => todo.priority === filterPriority);
  if (filterUser) filtered = filtered.filter(todo => todo.user.toLowerCase().includes(filterUser.toLowerCase()));
  if (filterTag) filtered = filtered.filter(todo => todo.tag === filterTag);
  if (sortBy === 'date') filtered.sort((a, b) => b.id - a.id);
  if (sortBy === 'priority') {
    const order = { High: 3, Medium: 2, Low: 1 };
    filtered.sort((a, b) => order[b.priority] - order[a.priority]);
  }

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filtered.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(filtered.length / todosPerPage);

  return (
    <div>
      <h2>Todo App (User: {currentUser})</h2>
      <label>Switch User:</label>
      <select value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}>
        {predefinedUsers.map(user => <option key={user}>{user}</option>)}
      </select>

      <input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder='Description (use @username to mention)' value={description} onChange={(e) => setDescription(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        {predefinedTags.map(tag => <option key={tag}>{tag}</option>)}
      </select>
      <button onClick={handleSubmit}>{editId ? 'Update' : 'Add'} Todo</button>

      <div style={{ marginTop: 20 }}>
        <label>Filter Priority:</label>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value=''>All</option>
          <option value='High'>High</option>
          <option value='Medium'>Medium</option>
          <option value='Low'>Low</option>
        </select>

        <label> Filter User: </label>
        <input value={filterUser} onChange={(e) => setFilterUser(e.target.value)} />

        <label> Filter Tag: </label>
        <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
          <option value=''>All</option>
          {predefinedTags.map(tag => <option key={tag}>{tag}</option>)}
        </select>

        <label> Sort by: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value=''>None</option>
          <option value='date'>Date</option>
          <option value='priority'>Priority</option>
        </select>
      </div>

      <div>
        <button onClick={exportJSON}>Export JSON</button>
        <button onClick={exportCSV}>Export CSV</button>
      </div>

      <table border={1} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>User</th>
            <th>Tag</th>
            <th>Mentions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTodos.map((todo, index) => (
            <tr key={todo.id}>
              <td>{indexOfFirstTodo + index + 1}</td>
              <td>
                <span
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => {
                    setSelectedTodo(todo);
                    setShowDetailsModal(true);
                  }}
                >
                  {todo.title}
                </span>
              </td>
              <td>{todo.description}</td>
              <td>{todo.priority}</td>
              <td>{todo.user}</td>
              <td>{todo.tag}</td>
              <td>{todo.mentionedUsers?.join(', ')}</td>
              <td>
                <button onClick={() => handleEdit(todo)}>Edit</button>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
                <button onClick={() => openNotesModal(todo.id)}>📝 Notes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{ marginRight: 5, background: currentPage === i + 1 ? 'lightblue' : 'white' }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showNotesModal && (
        <div style={{ position: 'fixed', top: '20%', left: '30%', width: '40%', background: 'white', padding: 20, border: '1px solid gray', zIndex: 1000 }}>
          <h3>Notes</h3>
          <input
            type='text'
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder='Add a note'
          />
          <button onClick={handleAddNote}>Add Note</button>
          <button onClick={() => setShowNotesModal(false)}>Close</button>
          <ul>
            {todos.find(t => t.id === activeTodoId)?.notes?.map((note, i) => (
              <li key={i}>{note.text} - <small>{new Date(note.date).toLocaleString()}</small></li>
            ))}
          </ul>
        </div>
      )}

      {showDetailsModal && selectedTodo && (
        <div style={{ position: 'fixed', top: '15%', left: '30%', width: '40%', background: 'white', padding: 20, border: '1px solid gray', zIndex: 1000 }}>
          <h3>Todo Details</h3>
          <p><strong>Title:</strong> {selectedTodo.title}</p>
          <p><strong>Description:</strong> {selectedTodo.description}</p>
          <p><strong>Priority:</strong> {selectedTodo.priority}</p>
          <p><strong>User:</strong> {selectedTodo.user}</p>
          <p><strong>Tag:</strong> {selectedTodo.tag}</p>
          <p><strong>Mentions:</strong> {selectedTodo.mentionedUsers?.join(', ')}</p>
          <div>
            <strong>Notes:</strong>
            <ul>
              {selectedTodo.notes?.map((note, i) => (
                <li key={i}>{note.text} - <small>{new Date(note.date).toLocaleString()}</small></li>
              ))}
            </ul>
          </div>
          <button onClick={() => setShowDetailsModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
