import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import appleImage from '../images/apple.jpg';
import bananaImage from '../images/banana.jfif';
import strawberryImage from '../images/strawberry.jfif';

function Example2_2() {
  // 1. 이미지 URL을 포함한 초기 데이터 설정
  // 바로 동작 확인이 가능하도록 외부 이미지 링크를 예시로 사용했습니다.
  const initialProducts = [
    { id: uuidv4(), name: '사과', price: 3500, image: appleImage },
    { id: uuidv4(), name: '바나나', price: 4000, image: bananaImage },
    { id: uuidv4(), name: '딸기', price: 10000, image: strawberryImage },
  ];

  // 2. 이미지 URL 입력을 위한 state(imageUrl) 추가
  const [products, setProducts] = useState(initialProducts);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // 3. 상품 추가 핸들러 수정
  const handleAddProduct = () => {
    // 이미지 URL 입력값도 확인
    if (productName.trim() === '' || productPrice.trim() === '' || imageUrl.trim() === '') {
      alert('상품명, 가격, 이미지 URL을 모두 입력해주세요.');
      return;
    }

    const newProduct = {
      id: uuidv4(),
      name: productName,
      price: Number(productPrice),
      image: imageUrl, // state에서 이미지 URL 값을 가져와 사용
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);

    // 모든 입력 필드 초기화
    setProductName('');
    setProductPrice('');
    setImageUrl('');
  };

  // 상품 삭제 핸들러 (변경 없음)
  const handleRemoveProduct = (id) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  return (
    <div style={{ width: '400px', margin: '0 auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>🛒 이미지 쇼핑 리스트</h2>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="상품명"
          style={{ width: 'calc(100% - 16px)', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="가격"
          style={{ width: 'calc(100% - 16px)', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        {/* 4. 이미지 URL 입력 필드 추가 */}
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="이미지 URL (예: /images/photo.png 또는 http://...)"
          style={{ width: 'calc(100% - 16px)', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          onClick={handleAddProduct}
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
        >
          상품 추가
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map(product => (
          <li
            key={product.id}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 5px', borderBottom: '1px solid #eee' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* 5. <img> 태그를 사용하여 이미지 렌더링 */}
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '60px', height: '60px', borderRadius: '8px', marginRight: '15px', objectFit: 'cover' }} 
              />
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{product.name}</span><br />
                <span style={{ color: '#007bff' }}>{product.price.toLocaleString()}원</span>
              </div>
            </div>
            <button
              onClick={() => handleRemoveProduct(product.id)}
              style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      <p style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '20px' }}>
        총 상품 개수: {products.length}개
      </p>
    </div>
  );
}

export default Example2_2;