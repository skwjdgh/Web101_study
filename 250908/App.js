import React ,{ useState } from 'react';
import GreetUser from './exam/GreetUser';
import ProfileCard from './exam/ProfileCard';
import Highlight from './exam/Highligtht'; 
import Layout from './exam/Layout';
import Card from './exam/Card';
import LayoutHook from './exam/LayoutHook';
import LikesButton from './exam/LikesButton';
import ButtonLogger from './exam/ButtonLogger';
import BasicClickExample from './exam/BasicClickExample';
import InputChangeExample from './exam/InputChangeExample';
import ProductList from './exam/ProductList';
import SignUpForm from './exam/SignUpForm';
import FeedbackForm from './exam/FeedbackForm';
import CharactorCounter from './exam/CharactorCounter';

import './App.css'; // 기본 스타일링을 위해 App.css를 가져옵니다.


function App() {
////////////////////////////////////////////////////////////////////////////////////////////
// 1. Props 기본값 실습 1
////////////////////////////////////////////////////////////////////////////////////////////

  // return (
  //   <div className="App">

  //     <ProfileCard name = "김철수" occupation = "개발자" age ={28}/>
  //     <ProfileCard name = "이영희" occupation = "디자이너"/>
  //     <ProfileCard/>
      
  //   </div>

  // );

////////////////////////////////////////////////////////////////////////////////////////////
// 2. children Props 실습
////////////////////////////////////////////////////////////////////////////////////////////
  
  // return (
  //   <div className="App">
  //     <Highlight>
  //       <strong>안내: </strong> 리액트 프로그래밍 204호실
  //     </Highlight>
  //   </div>

  // )

////////////////////////////////////////////////////////////////////////////////////////////
// 3. children Props 활용 실습1
////////////////////////////////////////////////////////////////////////////////////////////

  // return (
  //   <div className="App">
  //     <Layout>

  //         <h1><b>1. 웹프로그래밍이란?</b></h1>
  //         <p>웹프로그래밍은 HTML, CSS, JavaScript를 기반으로 웹사이트와 웹 어플리케이션을 만드는 작업입니다. 사용자의 입력에 따라 동적으로 반응하는 UI를 구현하며, 클라이언트와 서버 간 통신도 포함됩니다.</p>

  //     </Layout>
  //     <Layout>

  //         <h1><b>2. 리액트 프로그래밍이란?</b></h1>
  //         <p>리액트는 컴포넌트 기반으로 UI를 구성하는 JavaScript 라이브러리입니다. 상태state에 따라 화면을 자동으로 업데이트하며, 재사용 가능한 컴포넌트를 통해 효율적인 개발이 가능합니다.</p>

  //     </Layout>
  //   </div>
  // )

////////////////////////////////////////////////////////////////////////////////////////////
// 4. children Props 활용 실습2
////////////////////////////////////////////////////////////////////////////////////////////

  // return (
  //   <div className="App">

  //     <Card>
  //       <h2>공지사항</h2>
  //       <p>이번 주 금요일은 휴강입니다.</p>
  //     </Card>

  //     <Card>
  //       <h2>과제 안내</h2>
  //       <p>3주차까지 제출하세요.</p>
  //       <button>자세히 보기</button>
  //     </Card>
      
  //   </div>
  // )

////////////////////////////////////////////////////////////////////////////////////////////
// 5-1. State 훅 실습
////////////////////////////////////////////////////////////////////////////////////////////

  // const [currentPage, setPage] = useState('web');

  // let content;
  // if (currentPage === 'web') {
  //   content = (
  //     <>
  //       <h1>웹프로그래밍이란?</h1>
  //       <p>
  //         웹프로그래밍은 HTML, CSS, JavaScript를 기반으로 웹사이트와 웹 애플리케이션을 만드는 작업입니다.
  //         사용자의 입력에 따라 동적으로 반응하는 UI를 구현하며, 클라이언트와 서버 간 통신도 포함됩니다.
  //       </p>
  //     </>
  //   );
  // } else if (currentPage === 'react') {
  //   content = (
  //     <>
  //       <h1>리액트프로그래밍이란?</h1>
  //       <p>
  //         리액트는 컴포넌트 기반으로 UI를 구성하는 JavaScript 라이브러리입니다. 
  //         상태(state)에 따라 화면을 자동으로 업데이트하며, 재사용 가능한 컴포넌트를 통해 효율적인 개발이 가능합니다.
  //       </p>
  //     </>
  //   );
  // } else if (currentPage === 'notice') {
  //   content = (
  //     <>
  //       <h1>공지사항</h1>
  //       <p>다음 주부터 실습 비중이 높아집니다. 노트북을 꼭 지참해주세요!</p>
  //     </>
  //   );
  // }

  // return (
  //   <LayoutHook currentPage={currentPage} setPage={setPage}>
  //     {content}
  //   </LayoutHook>
  // );

////////////////////////////////////////////////////////////////////////////////////////////
// 5-2. 논리 연산자 방식
////////////////////////////////////////////////////////////////////////////////////////////

  // const [currentPage, setPage] = useState('web');

  // return <LayoutHook currentPage={currentPage} setPage={setPage} />;

////////////////////////////////////////////////////////////////////////////////////////////
// 5-3. 삼항 연산자 방식
////////////////////////////////////////////////////////////////////////////////////////////
 
  // const [currentPage, setPage] = useState('web');

  // return <LayoutHook currentPage={currentPage} setPage={setPage} />;

////////////////////////////////////////////////////////////////////////////////////////////
// 6. State 응용 실습
////////////////////////////////////////////////////////////////////////////////////////////

// return (
//     <div className="App">
//       <LikesButton />
//     </div>
//   );

////////////////////////////////////////////////////////////////////////////////////////////
// 7. 리액트 이벤트 핸들링
////////////////////////////////////////////////////////////////////////////////////////////

  // return (
  //   <div className="App">
  //     <BasicClickExample/>
  //     <ButtonLogger/>
  //     <InputChangeExample/>
  //     <ProductList/>
  //   </div>
  // );

////////////////////////////////////////////////////////////////////////////////////////////
// 8. 회원가입 폼
////////////////////////////////////////////////////////////////////////////////////////////
 
  // return (
  //   <div className="App">
  //     <SignUpForm/>
  //   </div>
  // );

////////////////////////////////////////////////////////////////////////////////////////////
// 9. 실습 1,2 - 제품 사용 후기
////////////////////////////////////////////////////////////////////////////////////////////

  // return (
  //   <div className="App">
  //     <FeedbackForm/>
  //   </div>
  // );

////////////////////////////////////////////////////////////////////////////////////////////
// 10. 실습 2 - 실시간 글자수 카운터
////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="App">
      <CharactorCounter/>
    </div>
  )

}


export default App;