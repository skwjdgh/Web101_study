import React from "react";

function Layout({ children }) {

    const headerStyle = {
    backgroundColor: '#3498db',
    textAlign: 'center',
    padding: '15px',
    color: 'white',
    fontSize: '20px'
    };

    const mainStyle = {
    padding: '20px'
      };

    const footerStyle = {
    padding: '15px 20px',
    textAlign: 'center',
    fontSize: '15px',
    backgroundColor: 'lightgrey'

  };

    return (

    <div>
        <header style = {headerStyle}>프론트앤드 프로그래밍</header>
        <main style = {mainStyle}>
            {children}
        </main>
        <footer style ={footerStyle}>© 2025 소프트웨어융합과 하이테크 과정 </footer>
    </div>
    );
}

export default Layout;