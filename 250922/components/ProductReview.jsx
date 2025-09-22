import { useEffect, useState } from "react";

const PRODUCT_SEED = {
  id: 1,
  name: "에코 텀블러",
  description: "환경을 생각하는 당신을 위한 텀블러",
  reviews: [],
};
const LS_KEY = "reviews_v2";

export default function ProductReview() {
  const [product, setProduct] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || PRODUCT_SEED; }
    catch { return PRODUCT_SEED; }
  });
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(product));
  }, [product]);

  const add = () => {
    const t = newReview.trim();
    if (!t) return;
    setProduct((p) => ({
      ...p,
      reviews: [
        { id: Date.now(), text: t, createdAt: new Date().toISOString() },
        ...p.reviews,
      ],
    }));
    setNewReview("");
  };

  const remove = (id) =>
    setProduct((p) => ({ ...p, reviews: p.reviews.filter((r) => r.id !== id) }));

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>{product.name}</h2>
      <p style={{ color: "#555" }}>{product.description}</p>

      <h3 style={{ marginTop: 16 }}>리뷰 작성</h3>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          placeholder="리뷰 내용을 입력하세요"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          style={{ width: 420, padding: 8, border: "1px solid #bbb", borderRadius: 4 }}
        />
        <button onClick={add} style={{ padding: "8px 14px" }}>등록</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginTop: 18 }}>
        <section>
          <h3 style={{ marginBottom: 8 }}>
            리뷰 목록 ({product.reviews.length}개)
          </h3>
          {product.reviews.length === 0 ? (
            <p style={{ color: "#666" }}>아직 작성된 리뷰가 없습니다.</p>
          ) : (
            <ul style={{ listStyle: "disc", paddingLeft: 20 }}>
              {product.reviews.map((r) => (
                <li key={r.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span>“{r.text}”</span>
                    <small style={{ color: "#888" }}>
                      작성일: {new Date(r.createdAt).toLocaleDateString()} {new Date(r.createdAt).toLocaleTimeString()}
                    </small>
                    <button
                      onClick={() => remove(r.id)}
                      style={{ marginLeft: 8, padding: "2px 8px" }}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
