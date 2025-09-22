import TodoList from "./components/TodoList";
import ShoppingCartPage from "./components/ShoppingCartPage"; 
import ProductReview from "./components/ProductReview";
import Invitation from "./components/Invitation";

export default function App() {
  return (
    <div style={{ display: "grid", gap: 20, padding: 20 }}>
      <TodoList />            {/* 1 */}
      <ShoppingCartPage />    {/* 2 */}
      <ProductReview />       {/* 3 */}
      <Invitation startISO="2025-09-23T10:00:00+09:00"/>          {/* 4 */}
    </div>
  );
}
