// ====== 카테고리 모듈 ======
class Category {
  constructor() {
    this.categories = [
      { id: 'all', name: '📚 전체', active: true },
      { id: 'projects', name: '💻 프로젝트', active: false },
      { id: 'blog', name: '📝 블로그', active: false },
      { id: 'study', name: '📖 스터디', active: false }
    ];
    this.activeCategory = 'all';
    this.categoryContainer = null;
    this.initElements();
    this.bindEvents();
  }

  // DOM 요소 초기화
  initElements() {
    this.categoryContainer = document.querySelector('.category-container');
  }

  // 이벤트 바인딩
  bindEvents() {
    if (this.categoryContainer) {
      // 카테고리 탭 클릭 이벤트 (이벤트 위임 사용)
      this.categoryContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-tab')) {
          const categoryId = e.target.dataset.category;
          this.selectCategory(categoryId);
        }
      });
    }
  }

  // 카테고리 선택
  selectCategory(categoryId) {
    // 이전 활성 탭 비활성화
    const prevActiveTab = this.categoryContainer.querySelector('.category-tab.active');
    if (prevActiveTab) {
      prevActiveTab.classList.remove('active');
    }

    // 새 탭 활성화
    const newActiveTab = this.categoryContainer.querySelector(`[data-category="${categoryId}"]`);
    if (newActiveTab) {
      newActiveTab.classList.add('active');
      this.activeCategory = categoryId;
      
      // 콘텐츠 필터링
      this.filterContent(categoryId);
      
      // 상태 저장
      this.saveToStorage();
    }
  }

  // 콘텐츠 필터링
  filterContent(categoryId) {
    const thumbnails = document.querySelectorAll('.content-thumbnail');
    
    thumbnails.forEach(thumbnail => {
      if (categoryId === 'all') {
        // 전체 카테고리인 경우 모든 썸네일 표시
        thumbnail.style.display = 'flex';
        thumbnail.style.animation = 'fadeInUp 0.3s ease-out';
      } else {
        // 특정 카테고리의 경우 해당 카테고리만 표시
        const categoryTag = thumbnail.querySelector('[style*="position: absolute"]');
        if (categoryTag) {
          const categoryText = categoryTag.textContent.toLowerCase();
          const shouldShow = this.matchesCategory(categoryText, categoryId);
          
          if (shouldShow) {
            thumbnail.style.display = 'flex';
            thumbnail.style.animation = 'fadeInUp 0.3s ease-out';
          } else {
            thumbnail.style.display = 'none';
          }
        }
      }
    });

    // 필터링 결과 메시지 업데이트
    this.updateFilterMessage(categoryId);
  }

  // 카테고리 매칭 확인
  matchesCategory(categoryText, categoryId) {
    const categoryMap = {
      'projects': ['프로젝트', 'project'],
      'blog': ['블로그', 'blog'],
      'study': ['스터디', 'study']
    };

    const keywords = categoryMap[categoryId] || [];
    return keywords.some(keyword => categoryText.includes(keyword));
  }

  // 필터링 결과 메시지 업데이트
  updateFilterMessage(categoryId) {
    const contentArea = document.getElementById('contentArea');
    const headerSection = contentArea.querySelector('div[style*="margin-bottom: 20px"]');
    
    if (headerSection) {
      const categoryNames = {
        'all': '전체',
        'projects': '프로젝트',
        'blog': '블로그',
        'study': '스터디'
      };

      const visibleThumbnails = document.querySelectorAll('.content-thumbnail[style*="display: flex"], .content-thumbnail:not([style*="display: none"])');
      const count = Array.from(visibleThumbnails).filter(t => t.style.display !== 'none').length;
      
      const categoryName = categoryNames[categoryId] || categoryId;
      
      headerSection.innerHTML = `
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px;">
          📋 ${categoryName === '전체' ? '최근 작성된 내용' : `${categoryName} 카테고리`}
        </h2>
        <div style="font-size: 14px; color: #666; margin-bottom: 20px;">
          ${count}개의 항목이 있습니다. 더블클릭하여 편집하거나, 우클릭하여 메뉴를 확인하세요.
        </div>
      `;
    }
  }

  // 새 카테고리 추가
  addNewCategory() {
    showPrompt('새 카테고리 이름을 입력하세요:', '', (name) => {
      if (name && name.trim()) {
        const categoryId = name.toLowerCase().replace(/\s+/g, '_');
        const categoryName = `📁 ${name.trim()}`;
        
        // 중복 확인
        const existingTab = this.categoryContainer.querySelector(`[data-category="${categoryId}"]`);
        if (existingTab) {
          showAlert('이미 존재하는 카테고리입니다.');
          return;
        }

        // 새 카테고리 탭 생성
        const newTab = document.createElement('div');
        newTab.className = 'category-tab';
        newTab.dataset.category = categoryId;
        newTab.textContent = categoryName;

        // 추가 버튼 앞에 삽입
        const addBtn = this.categoryContainer.querySelector('.add-category-btn');
        this.categoryContainer.insertBefore(newTab, addBtn);

        // 카테고리 배열에 추가
        this.categories.push({
          id: categoryId,
          name: categoryName,
          active: false
        });

        this.saveToStorage();
        showAlert('새 카테고리가 추가되었습니다!');
      }
    });
  }

  // 카테고리 삭제 (우클릭 메뉴)
  showCategoryContextMenu(categoryId, x, y) {
    // 기본 카테고리는 삭제 불가
    const defaultCategories = ['all', 'projects', 'blog', 'study'];
    if (defaultCategories.includes(categoryId)) {
      return;
    }

    // 기존 메뉴 제거
    const existingMenu = document.querySelector('.category-context-menu');
    if (existingMenu) existingMenu.remove();

    const contextMenu = document.createElement('div');
    contextMenu.className = 'category-context-menu';
    contextMenu.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      min-width: 120px;
      overflow: hidden;
    `;

    const deleteItem = document.createElement('div');
    deleteItem.textContent = '🗑️ 카테고리 삭제';
    deleteItem.style.cssText = `
      padding: 10px 15px;
      cursor: pointer;
      font-size: 14px;
      color: #dc3545;
      transition: background-color 0.2s;
    `;

    deleteItem.addEventListener('mouseenter', () => {
      deleteItem.style.backgroundColor = '#f8f9fa';
    });

    deleteItem.addEventListener('click', () => {
      this.deleteCategory(categoryId);
      contextMenu.remove();
    });

    contextMenu.appendChild(deleteItem);
    document.body.appendChild(contextMenu);

    // 바깥 클릭 시 메뉴 닫기
    setTimeout(() => {
      document.addEventListener('click', function closeMenu() {
        contextMenu.remove();
        document.removeEventListener('click', closeMenu);
      });
    }, 10);
  }

  // 카테고리 삭제
  deleteCategory(categoryId) {
    showConfirm('이 카테고리를 삭제하시겠습니까?', () => {
      // DOM에서 제거
      const tabToDelete = this.categoryContainer.querySelector(`[data-category="${categoryId}"]`);
      if (tabToDelete) {
        tabToDelete.remove();
      }

      // 배열에서 제거
      this.categories = this.categories.filter(cat => cat.id !== categoryId);

      // 삭제된 카테고리가 현재 활성 카테고리인 경우 전체로 변경
      if (this.activeCategory === categoryId) {
        this.selectCategory('all');
      }

      this.saveToStorage();
      showAlert('카테고리가 삭제되었습니다.');
    });
  }

  // 현재 활성 카테고리 반환
  getActiveCategory() {
    return this.activeCategory;
  }

  // 카테고리 목록 반환
  getCategories() {
    return this.categories;
  }

  // 카테고리별 색상 반환
  getCategoryColor(categoryId) {
    const colorMap = {
      'all': '#6c757d',
      'projects': '#007bff',
      'blog': '#dc3545',
      'study': '#ffc107'
    };
    return colorMap[categoryId] || '#28a745';
  }

  // 로컬스토리지에 저장
  saveToStorage() {
    try {
      const categoryData = {
        categories: this.categories,
        activeCategory: this.activeCategory
      };
      localStorage.setItem('category_settings', JSON.stringify(categoryData));
    } catch (error) {
      console.error('카테고리 설정 저장 실패:', error);
    }
  }

  // 로컬스토리지에서 로드
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('category_settings');
      if (saved) {
        const categoryData = JSON.parse(saved);
        
        // 기본 카테고리는 유지하고 추가된 카테고리만 복원
        const defaultCategories = ['all', 'projects', 'blog', 'study'];
        const customCategories = categoryData.categories.filter(cat => !defaultCategories.includes(cat.id));
        
        // 커스텀 카테고리 DOM에 추가
        customCategories.forEach(category => {
          const newTab = document.createElement('div');
          newTab.className = 'category-tab';
          newTab.dataset.category = category.id;
          newTab.textContent = category.name;

          const addBtn = this.categoryContainer.querySelector('.add-category-btn');
          this.categoryContainer.insertBefore(newTab, addBtn);
        });

        this.categories = [...this.categories, ...customCategories];
        
        // 활성 카테고리 복원
        if (categoryData.activeCategory) {
          this.selectCategory(categoryData.activeCategory);
        }
      }
    } catch (error) {
      console.error('카테고리 설정 로드 실패:', error);
    }
  }

  // 초기화
  init() {
    this.loadFromStorage();
    
    // 우클릭 이벤트 추가
    if (this.categoryContainer) {
      this.categoryContainer.addEventListener('contextmenu', (e) => {
        if (e.target.classList.contains('category-tab')) {
          e.preventDefault();
          const categoryId = e.target.dataset.category;
          this.showCategoryContextMenu(categoryId, e.clientX, e.clientY);
        }
      });
    }
  }

  // 정리 작업
  cleanup() {
    this.saveToStorage();
  }
}

// 전역 함수들
window.addNewCategory = () => {
  if (window.categoryInstance) {
    window.categoryInstance.addNewCategory();
  }
};

window.filterByCategory = (categoryId) => {
  if (window.categoryInstance) {
    window.categoryInstance.selectCategory(categoryId);
  }
};

// 전역에서 사용할 수 있도록 등록
window.Category = Category;