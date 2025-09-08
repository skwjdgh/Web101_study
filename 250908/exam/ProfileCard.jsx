import React from "react";

function ProfileCard({name="익명 사용자", occupation="알 수 없음", age="알 수 없음"}) {
    return (
        <div style ={{ border: '1px solid #007bff', padding: '15px', margin: '10px'}}>
            <h3>
                <b>{name}</b>
            </h3>
            <p>직업: {occupation}</p>
            <p>나이: {age}</p>
        
        </div>
        )
    }

    
// 다른 파일에서 ProfileCard 컴포넌트를 사용할 수 있도록 export 해줍니다.
export default ProfileCard;