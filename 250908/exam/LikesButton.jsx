import React, {useState} from "react";

function LikesButton() {
    const [count,setCount] = useState(0);

    const handleLikeClick = () => {
        setCount(count + 1);
    }

    const isButtonDisabled = count >= 10;

    return (
        <div>
            <p>👍좋아요 : {count}</p>
            <button
                onClick={handleLikeClick}
                disabled={isButtonDisabled}
            >
                좋아요 누르기
            </button>

        </div>
    )

}

export default LikesButton;