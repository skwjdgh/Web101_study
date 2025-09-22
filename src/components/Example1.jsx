import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// 자식 컴포넌트: 할 일 항목 하나를 렌더링하는 역할
function TodoItem({ todo, onRemove }) {
  return (
    <li>
      {todo.text}
      <button onClick={() => onRemove(todo.id)} style={{ marginLeft: '10px' }}>삭제</button>
    </li>
  );
}

// 부모 컴포넌트: 전체 Todo 앱의 상태와 로직을 관리
function MyTodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([
    { id: uuidv4(), text: '리액트 문법 정리' },
    { id: uuidv4(), text: 'props와 state 복습' }
  ]);

  // 할 일 추가 함수
  const handleAdd = () => {
    if (newTodo.trim() === '') return;
    setTodos([
      ...todos,
      { id: uuidv4(), text: newTodo }
    ]);
    setNewTodo('');
  };

  // 할 일 삭제 함수
  const handleRemove = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h2>나만의 Todo 앱</h2>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button onClick={handleAdd}>추가</button>
      </div>
      
      {/* --- 렌더링 방식 1: 자식 컴포넌트로 분리 --- */}
      <h3>방법 1: 자식 컴포넌트로 분리하여 렌더링</h3>
      <ul>
        {todos.length > 0 ? (
          todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onRemove={handleRemove} />
          ))
        ) : (
          <p>항목을 추가하세요</p>
        )}
      </ul>
      
      {/* --- 렌더링 방식 2: 컴포넌트 내에서 직접 렌더링 (추가된 부분) --- */}
      <h3>방법 2: 컴포넌트 내에서 직접 렌더링</h3>
      <ul>
        {todos.length > 0 ? (
          todos.map(todo => (
            <li key={todo.id}>
              {todo.text}
              <button onClick={() => handleRemove(todo.id)} style={{ marginLeft: '10px' }}>삭제</button>
            </li>
          ))
        ) : (
          <p>항목을 추가하세요</p>
        )}
      </ul>
    </div>
  );
}

export default MyTodoList;