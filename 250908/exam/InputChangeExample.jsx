import React, { useState } from 'react';


function InputChangeExample() {
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    return (
        <div>
            <p>입력된텍스트: {inputValue}</p>
            <input
                type="text"
                onChange={handleInputChange}
            />
        </div>
    );
 }


 export default InputChangeExample;