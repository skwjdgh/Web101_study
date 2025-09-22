
import { useEffect, useMemo, useState } from "react";

const PRODUCTS = [
  { id: 1, name: "사과", price: 1000, description: "국산 사과" },
  { id: 2, name: "바나나", price: 1500, description: "싱싱 바나나" },
  { id: 3, name: "딸기", price: 2000, description: "제철 딸기" },
];

const LS_KEY = "cart_v1";

export default function ShoppingCartPage() {
  // 검색 키워드
  const [keyword, setKeyword] = useState("");
  // 장바구니
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  });

  // 로컬스토리지 동기화
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }, [cart]);

  // 담기/증가/감소/제거/비우기
  const addToCart = (p) =>
    setCart((arr) => {
      const f = arr.find((it) => it.id === p.id);
      return f
        ? arr.map((it) => (it.id === p.id ? { ...it, quantity: it.quantity + 1 } : it))
        : [...arr, { id: p.id, name: p.name, price: p.price, quantity: 1 }];
    });

  const inc = (id) => setCart((arr) => arr.map((it) => it.id === id ? { ...it, quantity: it.quantity + 1 } : it));
  const dec = (id) =>
    setCart((arr) =>
      arr
        .map((it) => (it.id === id ? { ...it, quantity: Math.max(0, it.quantity - 1) } : it))
        .filter((it) => it.quantity > 0)
    );
  const remove = (id) => setCart((arr) => arr.filter((it) => it.id !== id));
  const clear = () => setCart([]);

  // 총액(reduce)
  const total = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [cart]
  );

  // 필터링
  const filtered = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase()) ||
      p.description.toLowerCase().includes(keyword.toLowerCase())
  );

  const lsSnapshot = (() => {
    try { return localStorage.getItem(LS_KEY) || "[]"; } catch { return "[]"; }
  })();

  return (
    <div style={{ padding: 20, border: "1px solid #bbb", borderRadius: 8 }}>
      <h2>2·3. ProductList + ShoppingCart</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* 상품 목록 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <h3>상품 목록</h3>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="상품 검색"
            style={{ width: "60%", padding: 8, marginBottom: 10 }}
          />
          <ul>
            {filtered.map((p) => (
              <li key={p.id} style={{ marginBottom: 6 }}>
                • {p.name} - {p.price.toLocaleString()}원
                <button onClick={() => addToCart(p)} style={{ marginLeft: 8 }}>담기</button>
              </li>
            ))}
          </ul>
        </div>

        {/* 장바구니 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <h3>장바구니</h3>
          {cart.length === 0 ? (
            <p>장바구니가 비어 있습니다.</p>
          ) : (
            <>
              <ul>
                {cart.map((it) => (
                  <li key={it.id} style={{ marginBottom: 6 }}>
                    • {it.name} ({it.quantity}개) - {(it.price * it.quantity).toLocaleString()}원
                    <button onClick={() => inc(it.id)} style={{ marginLeft: 8 }}>+</button>
                    <button onClick={() => dec(it.id)} style={{ marginLeft: 6 }}>-</button>
                    <button onClick={() => remove(it.id)} style={{ marginLeft: 6 }}>제거</button>
                  </li>
                ))}
              </ul>
              <h4>총 가격: {total.toLocaleString()}원</h4>
              <button onClick={clear}>비우기</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
