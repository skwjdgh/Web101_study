 import React, { useState } from "react";
 
 function ButtonLogger() {
    const [log, setLog] = useState('');
    const handleButtonClick = (buttonName) => {
        setLog(`${buttonName} 클릭함!`);
    };
 
    return (
        <div>
            <h2>로그: {log}</h2>
            <button onClick={() => handleButtonClick('버튼 1')}>
                버튼1
            </button>

            <button onClick={() => handleButtonClick('버튼 2')}>
                버튼2
            </button>
        </div>
    );
 }

 export default ButtonLogger;
 

