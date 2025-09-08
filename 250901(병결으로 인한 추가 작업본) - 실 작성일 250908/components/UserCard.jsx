function UserCard(props) {
  return (
    <div style={{ border: '1px solid gray', padding: '15px', margin: '10px' }}>
      <h3>이름: {props.name}</h3>
      <p>나이: {props.age}</p>
      <p>직업: {props.job}</p>
    </div>
  );
}

export default UserCard;
