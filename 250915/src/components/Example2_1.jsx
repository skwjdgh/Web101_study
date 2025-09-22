import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function Example2_1() {
  // 1. 이미지에 표시된 초기 데이터를 state의 기본값으로 설정
  const initialProducts = [
    { id: uuidv4(), name: '사과', price: 1500 },
    { id: uuidv4(), name: '바나나', price: 2000 },
    { id: uuidv4(), name: '딸기', price: 3000 },
  ];

  // 2. 상품 목록, 상품명, 가격을 위한 state 선언
  const [products, setProducts] = useState(initialProducts);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  // 3. '상품 추가' 버튼 클릭 시 실행될 핸들러 함수
  const handleAddProduct = () => {
    // 상품명이나 가격이 입력되지 않았으면 함수 종료
    if (productName.trim() === '' || productPrice.trim() === '') {
      alert('상품명과 가격을 모두 입력해주세요.');
      return;
    }

    // 추가할 새 상품 객체 생성
    const newProduct = {
      id: uuidv4(),
      name: productName,
      price: Number(productPrice), // 입력된 가격을 숫자로 변환
    };

    // 기존 products 배열에 새 상품을 추가하여 state 업데이트
    setProducts(prevProducts => [...prevProducts, newProduct]);

    // 입력 필드 초기화
    setProductName('');
    setProductPrice('');
  };

  // 4. '삭제' 버튼 클릭 시 실행될 핸들러 함수
  const handleRemoveProduct = (id) => {
    // 삭제할 id를 가진 상품을 제외한 새 배열을 만들어 state 업데이트
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  return (
    // 전체 레이아웃 스타일
    <div style={{ width: '350px', margin: '0 auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>🛒 나의 쇼핑 리스트</h2>

      {/* 입력 폼 영역 */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="상품명"
          style={{ width: 'calc(100% - 16px)', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="number" // 가격이므로 number 타입이 더 적절합니다.
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="가격"
          style={{ width: 'calc(100% - 16px)', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          onClick={handleAddProduct}
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
        >
          상품 추가
        </button>
      </div>

      {/* 상품 목록 렌더링 영역 */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map(product => (
          <li
            key={product.id}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5px', borderBottom: '1px solid #eee' }}
          >
            {/* toLocaleString()을 사용해 가격에 쉼표를 추가 */}
            <span>{product.name} - {product.price.toLocaleString()}원</span>
            <button
              onClick={() => handleRemoveProduct(product.id)}
              style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {/* 총 상품 개수 표시 */}
      <p style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '20px' }}>
        총 상품 개수: {products.length}개
      </p>
    </div>
  );
}

export default Example2_1;