import { useEffect, useState } from "react";

const LS_KEY = "todos_v1";

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  });
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos));
  }, [todos]);

  const add = () => {
    const t = newTodo.trim();
    if (!t) return;
    setTodos((arr) => [...arr, { id: Date.now(), text: t, completed: false }]);
    setNewTodo("");
  };
  const toggle = (id) =>
    setTodos((arr) => arr.map((v) => (v.id === id ? { ...v, completed: !v.completed } : v)));
  const del = (id) => setTodos((arr) => arr.filter((v) => v.id !== id));

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>1. TodoList</h2>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        placeholder="할 일을 입력하세요"
        style={{ width: "70%", padding: 8, marginRight: 8 }}
      />
      <button onClick={add}>추가</button>
      <ul style={{ marginTop: 12 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ textDecoration: t.completed ? "line-through" : "none" }}>
            {t.text}
            <button onClick={() => toggle(t.id)} style={{ marginLeft: 8 }}>
              {t.completed ? "미완료" : "완료"}
            </button>
            <button onClick={() => del(t.id)} style={{ marginLeft: 6 }}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
