import React, { useState } from 'react';


function BasicClickExample() {
  const [message, setMessage] = useState('버튼을 클릭하기 전입니다.');
  const handleBtnClick = () => {
    setMessage('버튼이 클릭되었습니다!');
  };
  
  return (
    <div>
      <p>{message}</p>
      <button onClick={handleBtnClick}>클릭하세요</button>
    </div>
  );
 }


 export default BasicClickExample;
 