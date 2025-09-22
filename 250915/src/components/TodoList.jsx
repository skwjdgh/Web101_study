import React, { useState } from 'react';

const initialTodos = [
  { id: 1, text: '리액트 문법 정리', completed: true },
  { id: 2, text: 'props와 state 복습', completed: true },
  { id: 3, text: '반복 렌더링 기능 정리', completed: false },
  { id: 4, text: '리액트 프로젝트 기획하기', completed: false },
  { id: 5, text: '새로운 Hook 배우기', completed: false },
];

function TodoList() {
  const [todos, setTodos] = useState(initialTodos);

  // 완료되지 않은 항목만 필터링
  const incompleteTodos = todos.filter(todo => !todo.completed);

  return (
    <div>
      <h2>미완료 할 일 목록</h2>
      <ul>
        {incompleteTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
