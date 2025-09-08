import React from 'react';

const layoutStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '20px',
  width: '600px',
  margin: '40px auto',
  fontFamily: 'sans-serif',
  backgroundColor: '#fdfdfd',
};

const headerStyle = {
  backgroundColor: '#4a90e2',
  color: 'white',
  padding: '10px',
  display: 'flex',
  justifyContent: 'space-around',
  cursor: 'pointer',
};

const footerStyle = {
  backgroundColor: '#eee',
  padding: '10px',
  fontSize: '14px',
  textAlign: 'center',
};

const mainStyle = {
  padding: '20px',
};
////////////////////////////////////////////////////////////////////////////////////////////
// 1. 기존 방식
////////////////////////////////////////////////////////////////////////////////////////////
// function LayoutHook({ currentPage, setPage, children }) {
//   return (
//     <div style={layoutStyle}>
//       <header style={headerStyle}>
//         <span onClick={() => setPage('web')}>웹프로그래밍</span>
//         <span onClick={() => setPage('react')}>리액트프로그래밍</span>
//         <span onClick={() => setPage('notice')}>공지</span>
//       </header>

//       <main style={mainStyle}>{children}</main>

//       <footer style={footerStyle}>ⓒ 2025 소프트웨어융합학과 하이테크 과정</footer>
//     </div>


//   );
// }




////////////////////////////////////////////////////////////////////////////////////////////
// 2. 논리연산자
////////////////////////////////////////////////////////////////////////////////////////////

// function LayoutHook({ currentPage, setPage }) {
//   return (
//     <div style={layoutStyle}>
//       <header style={headerStyle}>
//         <span onClick={() => setPage('web')}>웹프로그래밍</span>
//         <span onClick={() => setPage('react')}>리액트프로그래밍</span>
//         <span onClick={() => setPage('notice')}>공지</span>
//       </header>

//       <main style={mainStyle}>
//         {currentPage === 'web' && (
//           <>
//             <h1>웹프로그래밍이란?</h1>
//             <p>
//               웹프로그래밍은 HTML, CSS, JavaScript를 기반으로 웹사이트와 웹 애플리케이션을 만드는 작업입니다.
//             </p>
//           </>
//         )}
//         {currentPage === 'react' && (
//           <>
//             <h1>리액트프로그래밍이란?</h1>
//             <p>
//               리액트는 컴포넌트 기반으로 UI를 구성하는 JavaScript 라이브러리입니다.
//             </p>
//           </>
//         )}
//         {currentPage === 'notice' && (
//           <>
//             <h1>공지사항</h1>
//             <p>다음 주부터 실습 비중이 높아집니다. 노트북을 꼭 지참해주세요!</p>
//           </>
//         )}
//       </main>

//       <footer style={footerStyle}>ⓒ 2025 소프트웨어융합학과 하이테크 과정</footer>
//     </div>
//   );
// }



////////////////////////////////////////////////////////////////////////////////////////////
// 3. 삼항연산자
////////////////////////////////////////////////////////////////////////////////////////////

function LayoutHook({ currentPage, setPage }) {
  return (
    <div style={layoutStyle}>
      <header style={headerStyle}>
        <span onClick={() => setPage('web')}>웹프로그래밍</span>
        <span onClick={() => setPage('react')}>리액트프로그래밍</span>
        <span onClick={() => setPage('notice')}>공지</span>
      </header>

      <main style={mainStyle}>
        {currentPage === 'web' ? (
          <>
            <h1>웹프로그래밍이란?</h1>
            <p>
              웹프로그래밍은 HTML, CSS, JavaScript를 기반으로 웹사이트와 웹 애플리케이션을 만드는 작업입니다.
            </p>
          </>
        ) : currentPage === 'react' ? (
          <>
            <h1>리액트프로그래밍이란?</h1>
            <p>
              리액트는 컴포넌트 기반으로 UI를 구성하는 JavaScript 라이브러리입니다.
            </p>
          </>
        ) : (
          <>
            <h1>공지사항</h1>
            <p>다음 주부터 실습 비중이 높아집니다. 노트북을 꼭 지참해주세요!</p>
          </>
        )}
      </main>

      <footer style={footerStyle}>ⓒ 2025 소프트웨어융합학과 하이테크 과정</footer>
    </div>
  );
}
////////////////////////////////////////////////////////////////////////////////////////////

export default LayoutHook;