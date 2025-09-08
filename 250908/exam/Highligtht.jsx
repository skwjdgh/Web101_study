import React from "react"

function Highlight(props){

    return(
    <div style = {{backgroundColor: 'yellow'}}>
        <p>{props.children}</p>
    </div>
    );
}

export default Highlight;