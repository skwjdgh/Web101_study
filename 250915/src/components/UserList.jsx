// components/UserList.js
import React from 'react';
import User from './User';

function UserList() {
  // 1. 객체 배열 데이터 만들기
  const users = [
    { id: 1, name: '지수', email: 'jisu@example.com' },
    { id: 2, name: '민준', email: 'minjun@example.com' },
  ];

//   return (
//     <div>
//       <h3>사용자 목록</h3>
//       <ul>
//         {/* 2, 3. User 컴포넌트로 분리하고, key, props 사용 */}
//         {users.map(user => (
//           <User key={user.id} name={user.name} email={user.email} />
//         ))}
//       </ul>
//     </div>
//   );
    return (
        <div>
        <h2>사용자 목록</h2>
        <ul>
            {users.map(user => (
            <li key={user.id}>
                {user.name} : {user.email}
            </li>
            ))}
        </ul>
        </div>
    );


}

export default UserList;
