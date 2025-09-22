// 0. 필요 import
import React from 'react';

// 1. 리스트로 전환할 데이터 준비
function MyTodos() {
  const myTodos = [
    { id: 1, text: '리액트 강의 준비' },
    { id: 2, text: '운동하기' },
  ];

  return (
    <div>
      <h2>할 일 목록</h2>

      {/* 2. map()과 key 활용 */}
      {/* 
      <ul>
        {myTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      */}    

      {/* 3. 조건부 렌더링 + 객체 배열 map() */}
      <ul>
        {myTodos.length > 0 ? (
          myTodos.map(todo => (
            <li key={todo.id}>{todo.text}</li>
          ))
        ):(
          <p>항목을 추가하세요</p>
        )}
      </ul>

      {/* 4. 객체 배열 데이터 렌더링 방식
            - 같은 위치와 분리(컴포넌트) 위치 모두 예시
      */}
      {/* 같은 위치에서 map으로 렌더링 */}
      {/* 
      <ul>
        {myTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      */}

      {/* 별도 컴포넌트 분리 예시 */}
      {/* 
      <ul>
        {myTodos.map(todo => (
          <TodoItem key={todo.id} text={todo.text} />
        ))}
      </ul>
      */}
    </div>
  );
}

// 별도 분리 컴포넌트 예시(위 4번에서 사용)
// function TodoItem({ text }) {
//   return <li>{text}</li>;
// }

export default MyTodos;
