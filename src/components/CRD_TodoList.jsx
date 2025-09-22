import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 고유 ID 생성을 위해 uuid 라이브러리 사용

//배열 객체 데이터 준비
const initialTodos = [
  { id: uuidv4(), text: '리액트 문법 정리', completed: true },
  { id: uuidv4(), text: 'props와 state 복습', completed: true },
  { id: uuidv4(), text: '반복 렌더링 기능 정리', completed: false },
  { id: uuidv4(), text: '리액트 프로젝트 기획하기', completed: false },
  { id: uuidv4(), text: '새로운 훅(Hook) 배우기', completed: false },
];

function CRD_TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');

  // 새로운 할 일 추가 함수
  const handleAddTodo = () => {
    if (newTodo.trim() === '') return; // 빈 값 입력 방지
    const newId = uuidv4();
    const newTodoItem = { id: newId, text: newTodo, isCompleted: false };
    
    // 이전 배열에 새로운 아이템을 추가한 새로운 배열을 반환
    setTodos(prevTodos => [...prevTodos, newTodoItem]);
    setNewTodo(''); // 입력 필드 초기화
  };

  // 할 일 삭제 함수
  const handleRemoveTodo = (id) => {
    // 삭제할 아이템의 id와 다른 아이템들만 남겨 새로운 배열을 반환
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h2>할 일 목록</h2>
      <div>
        <input 
          type="text" 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
          placeholder="새로운 할 일을 입력하세요"
        />
        <button onClick={handleAddTodo}>추가</button>
      </div>
      <ul>
        { todos.length > 0? todos.map(todo => (
          <li key={todo.id}>
            {todo.text}({todo.completed?'(0)':'(X)'})
            <button onClick={() => handleRemoveTodo(todo.id)}>삭제</button>
          </li>
        )): <p>항목 추가하세요</p>}
      </ul>
    </div>
  );
}

export default CRD_TodoList;