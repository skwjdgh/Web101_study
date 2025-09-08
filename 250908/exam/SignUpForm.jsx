import React, { useState } from "react";

function SignUpForm() {


    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');


    const handleChange = (e) => {

        const { name, value } = e.target;
        setUserInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    // const handleNameChange = (e) => {
    //     setName(e.target.value);
    // };

    // const handleEmailChange = (e) => {
    //     setEmail(e.target.value);
    // };

        const handleSubmit = (e) => {
        e.preventDefault();
        alert(`가입정보\n이름: ${userInfo.name}\n이메일: ${userInfo.email}`);
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     alert(`가입정보\n이름: ${name}\n이메일: ${email}`);
    // };

    return (
    <form onSubmit={handleSubmit}>
        <h2>회원가입(독립된상태)</h2>
            <div>
                <label>
                    이름:
                    <input
                        type="text"
                        name = "name"
                        value = {userInfo.name}
                        // value={name}
                        onChange={handleChange}
                        // onChange={handleNameChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    이메일:
                    <input
                        type="email"
                        name = "email"
                        value={userInfo.email}
                        // value={email}
                        onChange={handleChange}
                        // onChange={handleEmailChange}
                    />
                </label>
            </div>
    
            <h3>입력된정보</h3>
            <p>이름: {userInfo.name}</p>
            <p>이메일: {userInfo.email}</p>
            {/* <p>이름: {name}</p>
            <p>이메일: {email}</p> */}
    
            <button type="submit">가입하기</button>
    </form>
    );
 }

 export default SignUpForm;