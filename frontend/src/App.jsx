import { useState, useEffect } from 'react'

const API = '/api/todos'

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => { fetchTodos() }, [])

  async function fetchTodos() {
    const res = await fetch(API)
    setTodos(await res.json())
  }

  async function addTodo() {
    if (!input.trim()) return
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input.trim(), completed: false }),
    })
    setInput('')
    fetchTodos()
  }

  async function toggleTodo(todo) {
    await fetch(`${API}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    })
    fetchTodos()
  }

  async function deleteTodo(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    fetchTodos()
  }

  async function saveEdit(todo) {
    await fetch(`${API}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, title: editText }),
    })
    setEditId(null)
    fetchTodos()
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Todo List</h1>

        <div style={s.row}>
          <input
            style={s.input}
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <button style={s.btn} onClick={addTodo}>Add</button>
        </div>

        {todos.length === 0 && (
          <p style={s.empty}>No tasks yet. Add one above!</p>
        )}

        <ul style={s.list}>
          {todos.map(todo => (
            <li key={todo.id} style={s.item}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                style={{ cursor: 'pointer' }}
              />

              {editId === todo.id ? (
                <input
                  style={{ ...s.input, flex: 1 }}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(todo)
                    if (e.key === 'Escape') setEditId(null)
                  }}
                  autoFocus
                />
              ) : (
                <span style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#999' : '#222',
                }}>
                  {todo.title}
                </span>
              )}

              {editId === todo.id ? (
                <button style={s.btnSm} onClick={() => saveEdit(todo)}>Save</button>
              ) : (
                <button style={s.btnSm} onClick={() => { setEditId(todo.id); setEditText(todo.title) }}>Edit</button>
              )}
              <button style={{ ...s.btnSm, background: '#fee2e2', color: '#dc2626' }} onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>

        {todos.length > 0 && (
          <p style={s.count}>
            {todos.filter(t => !t.completed).length} remaining · {todos.filter(t => t.completed).length} done
          </p>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', fontFamily: 'sans-serif' },
  card: { background: '#fff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' },
  title: { margin: '0 0 20px', fontSize: 24, fontWeight: 700, color: '#111' },
  row: { display: 'flex', gap: 8, marginBottom: 20 },
  input: { flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none' },
  btn: { padding: '8px 18px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 600 },
  btnSm: { padding: '4px 10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  item: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f9f9f9', borderRadius: 8 },
  empty: { color: '#aaa', textAlign: 'center', padding: '24px 0', margin: 0 },
  count: { marginTop: 16, fontSize: 13, color: '#888', textAlign: 'right' },
}
