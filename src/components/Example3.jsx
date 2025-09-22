import React from 'react';

// 1. 각 포스트의 데이터를 담고 있는 배열 객체
// 실습 이미지의 내용을 기반으로 데이터를 구성했습니다.
const postList = [
  {
    id: 1,
    title: '리액트 Hooks 완벽 가이드',
    author: '김개발',
    content: 'Hooks는 리액트 16.8 버전부터 도입된 기능으로, 함수 컴포넌트에서 상태와 생명주기 기능을 사용할 수 있게 해줍니다. 이 가이드에서는 useState, useEffect, u...'
  },
  {
    id: 2,
    title: 'JavaScript 비동기 프로그래밍 마스터',
    author: '이코딩',
    content: 'JavaScript에서 비동기 처리는 매우 중요합니다. 콜백 함수, Promise, async/await 패턴을 통해 비동기 코드를 작성하는 방법을 학습합니다. Node.js 환경...'
  },
  {
    id: 3,
    title: 'CSS Flexbox로 반응형 레이아웃 만들기',
    author: '박디자인',
    content: 'Flexbox는 CSS 레이아웃을 위한 강력한 도구입니다. 이 가이드에서는 Flexbox의 기본 개념부터 실제 웹사이트 레이아웃을 만드는 다양한 활용법을 다룹니다. Flexbox를...'
  }
];

// 2. 개별 포스트 항목을 렌더링하는 자식 컴포넌트
function BlogPostItem({ post }) {
  // 인라인 스타일 객체
  const styles = {
    postItem: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '0 0 8px 0'
    },
    author: {
      fontSize: '14px',
      color: '#888',
      marginBottom: '15px'
    },
    content: {
      fontSize: '16px',
      color: '#333',
      lineHeight: '1.6',
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '15px'
    }
  };

  return (
    <div style={styles.postItem}>
      <h3 style={styles.title}>{post.title}</h3>
      <p style={styles.author}>작성자: {post.author}</p>
      <p style={styles.content}>{post.content}</p>
      <button style={styles.button}>자세히 보기</button>
    </div>
  );
}

// 3. 전체 포스트 목록을 렌더링하는 부모 컴포넌트
function BlogPostList() {
  return (
    <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>최신 게시물</h1>
      <div>
        {postList.map(post => (
          <BlogPostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default BlogPostList;