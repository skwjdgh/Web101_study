import React from 'react';

// // 1. props 객체 전체를 인자로 받기
// function GreetUser(props) {
//     return (
//         <div>
//             <p>이름: {props.name}</p>
//             <p>나이: {props.age}</p>
//         </div>
//         );
// }

// 2.1 객체 비구조화 할당으로 필요한 props만 추출
function GreetUser({ name, age }) {
    return (
        <div>
            <p>이름: {name}</p>
            <p>나이: {age}</p>
        </div>
    );
}


export default GreetUser;