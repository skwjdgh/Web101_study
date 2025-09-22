export default function InviteCard({ title, dateRange, place, info }) {
  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>{title}</h2>
      <p><b>일자(기간)</b> {dateRange}</p>
      <p><b>장소</b> {place}</p>
      {info && <p style={{ whiteSpace: "pre-wrap", color: "#555" }}>{info}</p>}
    </div>
  );
}
