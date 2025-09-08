import React from "react";

function ProductList() {
    const handlePurchase = (productId, event) => {
        console.log(`상품 ID ${productId}가 구매되었습니다.`);
        console.log(`클릭된 좌표: X=${event.clientX}, Y=${event.clientY}`);
    };
    return (
        <div>
            <h3>구매가능한상품</h3>
            <button onClick={(e) => handlePurchase('product-1', e)}>
                상품1 구매
            </button>
            <button onClick={(e) => handlePurchase('product-2', e)}>
                상품2 구매
            </button>
        </div>
    );
 }

 export default ProductList;