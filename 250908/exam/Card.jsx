import React from "react";

function Card({children}) {

    const cardstyle ={
        textAlign : 'left'
    };
    
    return <div style ={cardstyle}>
        {children}
    </div>
}

export default Card;