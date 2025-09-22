import React, { useState } from 'react';

const initialTodos = [
  { id: 1, text: '리액트 문법 정리', completed: true },
  { id: 2, text: 'props와 state 복습', completed: true },
  { id: 3, text: '반복 렌더링 기능 정리', completed: false },
  { id: 4, text: '리액트 프로젝트 기획하기', completed: false },
  { id: 5, text: '새로운 Hook 배우기', completed: false },
];

function TodoSearch() {
  const [todos, setTodos] = useState(initialTodos);
  const [searchValue, setSearchValue] = useState('');

  // searchValue에 따라 todos 배열 필터링
  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      <h2>할 일 검색</h2>
      <input
        type="text"
        placeholder="검색어를 입력하세요..."
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
      <ul>
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoSearch;
