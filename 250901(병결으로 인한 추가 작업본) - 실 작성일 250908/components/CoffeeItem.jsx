function CoffeeItem({ name, price }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px 16px",
        marginBottom: "10px",
        backgroundColor: "#fff",
        width: "220px",

      }}
    >
      <strong>{name}</strong>
      <span style={{ color: "gray" }}>{price}원</span>
    </div>
  );
}

export default CoffeeItem;