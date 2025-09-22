import React, { useState } from 'react';

import MyTodos from './components/MyTodos';
import UserList from './components/UserList';
import TodoList from './components/TodoList';
import TodoSearch from './components/TodoSearch';
import CRD_TodoList from './components/CRD_TodoList';

import Example1 from './components/Example1';
import Example2_1 from './components/Example2_1';
import Example2_2 from './components/Example2_2';
import BlogPostItem from './components/Example3';

import './App.css';

function App() {
  // 선언한 이름: view, setView
  const [view, setView] = useState('home');

  return (
    <div className="App">
      <header className="App-header">
        {/* 사용해야 할 이름: view */}
        {view === 'home' ? (
          <>
            {/* 할 일 목록 렌더링 */}
            <MyTodos />
            {/* 사용자 목록 렌더링 */}
            <UserList />
            {/* 미완료 할 일 목록 */}
            <TodoList />
            {/* 할 일 검색 */}
            <TodoSearch />
            {/* 할 일 관리 */}
            <CRD_TodoList />

            <div style={{ marginTop: '30px', borderTop: '2px solid black', paddingTop: '20px' }}>
              <h3>페이지 전환하기</h3>
              {/* 사용해야 할 함수: setView */}
              <button onClick={() => setView('example1')}>
                Example 1 페이지 보기
              </button>
              <button onClick={() => setView('example2_1')}>
                Example 2_1 페이지 보기
              </button>
              <button onClick={() => setView('example2_2')}>
                Example 2_2 페이지 보기
              </button>
              <button onClick={() => setView('example3')}>
                Example 3 페이지 보기
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 사용해야 할 이름: view */}
            {view === 'example1' && <Example1 />}
            {view === 'example2_1' && <Example2_1 />}
            {view === 'example2_2' && <Example2_2 />}
            {view === 'example3' && <BlogPostItem />}

            <div style={{ marginTop: '30px' }}>
              {/* 사용해야 할 함수: setView */}
              <button onClick={() => setView('home')}>
                홈으로 돌아가기
              </button>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;