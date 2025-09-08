import React, {useState} from "react";

function CharactorCounter() {
    const [text, setText] = useState('');
    const maxLength = 20;

    const handleTextChange = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= maxLength) {
            setText(inputText);
        }
    };

    const counterStyle = {
        color: text.length === maxLength ? 'red' : 'black',
    };

    return(
        <div>
            <h2>실시간 글자수 카운터</h2>
            <textarea
                value = {text}
                onChange = {handleTextChange}
                rows = {5}
                style ={{ 
                    width: '300px'
                }}
            />
            <br/>
            <p style = {counterStyle}>
                현재 글자수: {text.length}/{maxLength}
            </p>
        </div>
    )

}

export default CharactorCounter;


// function InputChangeExample() {
//  const [inputValue, setInputValue] = useState('');
//  const handleInputChange = (e) => {
//  setInputValue(e.target.value);
//  };
//  return (
//  <div>
//  <p>입력된텍스트: {inputValue}</p>
//  <input
//  type="text"
//  onChange={handleInputChange}
//  />
//  </div>
//  );
//  }


// function LikesButton() {
//     const [count,setCount] = useState(0);

//     const handleLikeClick = () => {
//         setCount(count + 1);
//     }

//     const isButtonDisabled = count >= 10;
