import react, {use, useState} from "react";

function FeedbackForm() {

    const [userInfo, setUserInfo] = useState({ gender:'', age:'', email:'', review: ''})

    // const [name, setName] = useState('');
    // const [age, setAge] = useState('');
    // const [email, setEmail] = useState('');
    // const [review, setReview] = useState('');

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

    // const handleAgeChange = (e) => {
    //     setAge(e.target.value);
    // };

    // const handleEmailChange = (e) => {
    //     setEmail(e.target.value);
    // };

    // const handleReviewChange = (e) => {
    //     setReview(e.target.value);
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`감사합니다. 후기 쿠폰은 이메일로 발송됩니다.`);
    };


    return (
    <form onSubmit={handleSubmit}>
    <h2>제품 사용 후기 입력</h2>
    <div>
        <label>
        성별: 
        <input
            type="text"
            name = "gender"
            value = {userInfo.gender}
            // value={name}
            onChange = {handleChange}
            // onChange={handleNameChange}
        />
        </label>
    </div>

    <div>
        <label>
        나이: 
        <input
            type="text"
            name = "age"
            value = {userInfo.age}  
            // value={age}
            onChange = {handleChange}
            // onChange={handleAgeChange}
        />
        </label>
    </div>

    <div>
        <label>
        Email: 
        <input
            type="email"
            name = "email"
            value = {userInfo.email}
            // value={email}
            onChange = {handleChange}
            // onChange={handleEmailChange}
        />
        </label>
    </div>

    <div>
        <label>
            후기:<br/>
            <textarea
                name="review"
                // value={review}
                value = {userInfo.review}
                onChange = {handleChange}
                // onChange={handleReviewChange}
                rows="2"
                style={{width: '20%', boxSizing: 'border-box' }}
            />
        </label>
    </div>
 
    <button type="submit">전송</button>
    </form>
    );
 } 


 export default FeedbackForm;