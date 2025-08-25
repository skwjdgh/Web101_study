// ====== 개선된 카테고리 모듈 ======
class Category {
  constructor() {
    // 카테고리를 Map으로 관리 (중앙화)
    this.categories = new Map();
    this.activeCategory = 'all';
    this.categoryContainer = null;
    
    // 기본 카테고리 정의
    this.defaultCategories = [
      { 
        id: 'all', 
        name: '📚 전체', 
        color: '#6c757d', 
        keywords: ['전체', 'all'], 
        isDefault: true 
      },
      { 
        id: 'projects', 
        name: '💻 프로젝트', 
        color: '#007bff', 
        keywords: ['프로젝트', 'project', '개발', 'dev'], 
        isDefault: true 
      },
      { 
        id: 'blog', 
        name: '📝 블로그', 
        color: '#dc3545', 
        keywords: ['블로그', 'blog', '포스팅', 'post'], 
        isDefault: true 
      },
      { 
        id: 'study', 
        name: '📖 스터디', 
        color: '#ffc107', 
        keywords: ['스터디', 'study', '공부', '학습'], 
        isDefault: true 
      }
    ];
    
    // 이모지 목록 (깃모지 기반)
    this.emojiList = [
      '📚', '💻', '📝', '📖', '🎯', '🚀', '⚡', '🔥',
      '💡', '🎨', '🎵', '🎮', '📱', '🖥️', '⌚', '📷',
      '🎬', '📺', '🎪', '🎭', '🎨', '🖼️', '🎯', '🏆',
      '⭐', '🌟', '✨', '💎', '🔮', '🎪', '🎨', '🖌️',
      '✏️', '📏', '📐', '🔬', '🧪', '🔭', '🧬', '⚗️',
      '🧰', '🔧', '🔨', '⚙️', '🛠️', '🔩', '🧲', '🔗',
      '📊', '📈', '📉', '📋', '📌', '📍', '🗂️', '📁',
      '📂', '📄', '📃', '📑', '📜', '📰', '🗞️', '📞'
    ];
    
    // 색상 팔레트
    this.colorPalette = [
      '#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1',
      '#fd7e14', '#20c997', '#6c757d', '#e83e8c', '#17a2b8'
    ];
    
    this.initElements();
    this.bindEvents();
    this.initializeCategories();
  }

  // 카테고리 초기화
  initializeCategories() {
    this.defaultCategories.forEach(categoryData => {
      this.categories.set(categoryData.id, {
        ...categoryData,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      });
    });
  }

  // DOM 요소 초기화
  initElements() {
    this.categoryContainer = document.querySelector('.category-container');
  }

  // 이벤트 바인딩
  bindEvents() {
    if (this.categoryContainer) {
      // 카테고리 탭 클릭 이벤트
      this.categoryContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-tab')) {
          const categoryId = e.target.dataset.category;
          this.selectCategory(categoryId);
        }
      });

      // 우클릭 컨텍스트 메뉴
      this.categoryContainer.addEventListener('contextmenu', (e) => {
        if (e.target.classList.contains('category-tab')) {
          e.preventDefault();
          const categoryId = e.target.dataset.category;
          this.showCategoryContextMenu(categoryId, e.clientX, e.clientY);
        }
      });
    }
  }

  // 고유 ID 생성 (중복 방지)
  generateUniqueId(name) {
    // 기본 ID 생성 (한글 -> 영어 변환 포함)
    let baseId = this.createBaseId(name);
    let counter = 1;
    
    // 중복 검사 및 고유 ID 생성
    while (this.categories.has(baseId) || this.isReservedId(baseId)) {
      baseId = `${this.createBaseId(name)}_${counter}`;
      counter++;
    }
    return baseId;
  }

  // 기본 ID 생성
  createBaseId(name) {
    // 이모지 제거
    let cleanName = name.replace(/[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]/gu, '').trim();
    
    // 한글 -> 영어 변환 (간단한 매핑)
    const koreanToEnglish = {
      '프로젝트': 'project',
      '블로그': 'blog', 
      '스터디': 'study',
      '개발': 'dev',
      '디자인': 'design',
      '마케팅': 'marketing',
      '기획': 'planning',
      '분석': 'analysis',
      '리뷰': 'review',
      '튜토리얼': 'tutorial',
      '가이드': 'guide',
      '팁': 'tips',
      '뉴스': 'news',
      '이벤트': 'event'
    };
    
    // 한글 단어 변환
    Object.entries(koreanToEnglish).forEach(([korean, english]) => {
      cleanName = cleanName.replace(new RegExp(korean, 'g'), english);
    });
    
    // 안전한 ID 생성
    return cleanName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '') || 'category';
  }

  // 예약된 ID 검사
  isReservedId(id) {
    const reserved = ['all', 'new', 'add', 'edit', 'delete', 'admin', 'category'];
    return reserved.includes(id);
  }

  // 키워드 생성
  generateKeywords(categoryName) {
    const keywords = [];
    
    // 원본 이름 (이모지 제거)
    const cleanName = categoryName.replace(/[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]/gu, '').trim();
    keywords.push(cleanName.toLowerCase());
    
    // 단어 분리
    const words = cleanName.split(/\s+/);
    words.forEach(word => {
      if (word.length > 1) {
        keywords.push(word.toLowerCase());
      }
    });
    
    // 영어 번역 추가
    const translations = this.getTranslations(cleanName);
    keywords.push(...translations);
    
    return [...new Set(keywords)]; // 중복 제거
  }

  // 간단한 번역 매핑
  getTranslations(text) {
    const translationMap = {
      '프로젝트': ['project', 'proj'],
      '블로그': ['blog', 'post'],
      '스터디': ['study', 'learn'],
      '개발': ['dev', 'development'],
      '디자인': ['design', 'ui', 'ux'],
      '마케팅': ['marketing', 'promo'],
      '기획': ['planning', 'plan'],
      '분석': ['analysis', 'analytics'],
      '리뷰': ['review', 'feedback'],
      '튜토리얼': ['tutorial', 'guide'],
      '팁': ['tips', 'tip'],
      '뉴스': ['news', 'update'],
      '이벤트': ['event', 'activity']
    };
    
    const result = [];
    Object.entries(translationMap).forEach(([korean, english]) => {
      if (text.includes(korean)) {
        result.push(...english);
      }
    });
    
    return result;
  }

  // 랜덤 색상 선택
  getRandomColor() {
    const usedColors = Array.from(this.categories.values()).map(cat => cat.color);
    const availableColors = this.colorPalette.filter(color => !usedColors.includes(color));
    
    if (availableColors.length > 0) {
      return availableColors[Math.floor(Math.random() * availableColors.length)];
    } else {
      // 모든 색상이 사용된 경우 랜덤 색상 생성
      return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
    }
  }

  // 새 카테고리 추가
  addNewCategory() {
    const modalContent = `
      <div class="modal" style="width: 500px;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">새 카테고리 추가</div>
        
        <label>이모지:</label>
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <input type="text" id="categoryEmoji" value="📁" readonly style="
            width: 60px; 
            padding: 8px; 
            border: 1px solid #ddd; 
            border-radius: 6px; 
            text-align: center; 
            font-size: 20px;
            margin-right: 10px;
            cursor: pointer;
            background: #f8f9fa;
          ">
          <button id="selectEmojiBtn" style="
            background: #17a2b8; 
            color: white; 
            border: none; 
            padding: 8px 15px; 
            border-radius: 6px; 
            cursor: pointer;
            font-size: 14px;
          ">이모지 선택</button>
        </div>
        
        <label>카테고리 이름:</label>
        <input type="text" id="categoryName" placeholder="카테고리 이름을 입력하세요" style="width: 100%; box-sizing: border-box; margin-bottom: 12px;">
        
        <label>색상:</label>
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <input type="color" id="categoryColor" value="${this.getRandomColor()}" style="width: 50px; height: 35px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px;">
          <button id="randomColorBtn" style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">랜덤 색상</button>
        </div>
        
        <div style="font-size: 12px; color: #666; margin-bottom: 20px;">
          미리보기: <span id="categoryPreview" style="font-weight: bold; padding: 4px 8px; border-radius: 12px; color: white; background: ${this.getRandomColor()};">📁 새 카테고리</span>
        </div>
        
        <div class="modal-actions">
          <button id="saveCategoryBtn" style="background: #28a745; color: white;">✅ 추가</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">❌ 취소</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);

    const emojiInput = document.getElementById('categoryEmoji');
    const nameInput = document.getElementById('categoryName');
    const colorInput = document.getElementById('categoryColor');
    const preview = document.getElementById('categoryPreview');
    const selectEmojiBtn = document.getElementById('selectEmojiBtn');
    const randomColorBtn = document.getElementById('randomColorBtn');
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');

    // 미리보기 업데이트
    const updatePreview = () => {
      const emoji = emojiInput.value || '📁';
      const name = nameInput.value || '새 카테고리';
      const color = colorInput.value;
      preview.textContent = `${emoji} ${name}`;
      preview.style.backgroundColor = color;
    };

    // 이벤트 리스너들
    nameInput.addEventListener('input', updatePreview);
    colorInput.addEventListener('input', updatePreview);
    
    // 이모지 선택 버튼 이벤트 (개선된 방식)
    selectEmojiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      this.showEmojiPicker((selectedEmoji) => {
        emojiInput.value = selectedEmoji;
        updatePreview();
      });
    });

    // 이모지 입력창 클릭 시에도 이모지 선택 모달 열기
    emojiInput.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      this.showEmojiPicker((selectedEmoji) => {
        emojiInput.value = selectedEmoji;
        updatePreview();
      });
    });

    randomColorBtn.addEventListener('click', () => {
      colorInput.value = this.getRandomColor();
      updatePreview();
    });

    saveCategoryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const emoji = emojiInput.value.trim();
      const name = nameInput.value.trim();
      const color = colorInput.value;

      if (!name) {
        this.showAlert('카테고리 이름을 입력해주세요.');
        return;
      }

      const categoryData = {
        name: `${emoji} ${name}`,
        color: color
      };

      const newCategory = this.addCategory(categoryData);
      if (newCategory) {
        this.closeModal();
        this.showAlert('새 카테고리가 추가되었습니다!');
        
        // 콘텐츠 재분류 제안
        this.showCategoryMigrationModal(newCategory);
      }
    });

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveCategoryBtn.click();
      }
    });

    // 초기 미리보기
    updatePreview();
  }

  // 카테고리 추가 (핵심 메서드)
  addCategory(categoryData) {
    try {
      const id = this.generateUniqueId(categoryData.name);
      const category = {
        id,
        name: categoryData.name,
        color: categoryData.color || this.getRandomColor(),
        keywords: this.generateKeywords(categoryData.name),
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 카테고리 저장
      this.categories.set(id, category);

      // DOM에 탭 추가
      this.createCategoryTab(category);

      // 다른 시스템들에 알림
      this.notifySystemsOfCategoryChange();

      // 저장
      this.saveToStorage();

      return category;
    } catch (error) {
      console.error('카테고리 추가 실패:', error);
      this.showAlert('카테고리 추가에 실패했습니다.');
      return null;
    }
  }

  // 카테고리 탭 생성
  createCategoryTab(category) {
    const newTab = document.createElement('div');
    newTab.className = 'category-tab';
    newTab.dataset.category = category.id;
    newTab.textContent = category.name;

    // 추가 버튼 앞에 삽입
    const addBtn = this.categoryContainer.querySelector('.add-category-btn');
    if (addBtn) {
      this.categoryContainer.insertBefore(newTab, addBtn);
    } else {
      this.categoryContainer.appendChild(newTab);
    }
  }

  // 시스템 알림
  notifySystemsOfCategoryChange() {
    // 이벤트 발생
    const event = new CustomEvent('category:updated', {
      detail: {
        categories: this.getAllCategories(),
        categoryMap: this.getCategoryMap()
      },
      bubbles: true
    });
    document.dispatchEvent(event);

    // 콘텐츠 모듈에 직접 알림
    if (window.contentInstance) {
      window.contentInstance.onCategoryUpdated(this.getAllCategories());
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
      
      // 콘텐츠 필터링 (개선된 방식)
      this.filterContent(categoryId);
      
      // 상태 저장
      this.saveToStorage();
    }
  }

  // 개선된 콘텐츠 필터링
  filterContent(categoryId) {
    const thumbnails = document.querySelectorAll('.content-thumbnail');
    let visibleCount = 0;
    
    thumbnails.forEach(thumbnail => {
      const shouldShow = this.shouldShowContent(thumbnail, categoryId);
      
      if (shouldShow) {
        thumbnail.style.display = 'flex';
        thumbnail.style.animation = 'fadeInUp 0.3s ease-out';
        visibleCount++;
      } else {
        thumbnail.style.display = 'none';
      }
    });

    // 필터링 결과 메시지 업데이트
    this.updateFilterMessage(categoryId, visibleCount);
  }

  // 콘텐츠 표시 여부 결정 (개선된 로직)
  shouldShowContent(thumbnail, categoryId) {
    if (categoryId === 'all') return true;

    const contentId = parseInt(thumbnail.dataset.contentId);
    
    // 1. 데이터 속성에서 카테고리 확인 (가장 정확)
    if (thumbnail.dataset.category) {
      return thumbnail.dataset.category === categoryId;
    }

    // 2. 내부 콘텐츠에서 확인
    if (window.contentInstance) {
      const content = window.contentInstance.findContentById(contentId);
      if (content && content.category) {
        return content.category === categoryId;
      }
    }

    // 3. 키워드 기반 매칭 (레거시 지원)
    return this.legacyTextMatching(thumbnail, categoryId);
  }

  // 레거시 텍스트 매칭
  legacyTextMatching(thumbnail, categoryId) {
    const category = this.categories.get(categoryId);
    if (!category) return false;

    const categoryTag = thumbnail.querySelector('[style*="position: absolute"]');
    if (!categoryTag) return false;

    const categoryText = categoryTag.textContent.toLowerCase();
    return category.keywords.some(keyword => 
      categoryText.includes(keyword.toLowerCase())
    );
  }

  // 필터링 결과 메시지 업데이트
  updateFilterMessage(categoryId, visibleCount) {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
    const headerSection = contentArea.querySelector('div[style*="margin-bottom: 20px"]');
    if (!headerSection) return;

    const category = this.categories.get(categoryId);
    const categoryName = category ? category.name.replace(/^[\p{Emoji}]\s*/u, '') : '전체';
    
    headerSection.innerHTML = `
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px;">
        📋 ${categoryId === 'all' ? '최근 작성된 내용' : `${categoryName} 카테고리`}
      </h2>
      <div style="font-size: 14px; color: #666; margin-bottom: 20px;">
        ${visibleCount}개의 항목이 있습니다. 더블클릭하여 편집하거나, 우클릭하여 메뉴를 확인하세요.
      </div>
    `;
  }

  // 콘텐츠 재분류 모달
  showCategoryMigrationModal(newCategory) {
    // 기존 콘텐츠 수집
    const allContents = this.collectAllContents();
    
    if (allContents.length === 0) {
      return; // 콘텐츠가 없으면 모달 표시하지 않음
    }

    const modalContent = `
      <div class="modal" style="width: 600px; max-height: 80vh;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">콘텐츠 재분류</div>
        
        <p>새로 추가된 "<span style="color: ${newCategory.color}; font-weight: bold;">${newCategory.name}</span>" 카테고리로 이동할 콘텐츠를 선택하세요.</p>
        
        <div id="contentMigrationList" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin: 15px 0;">
          ${allContents.map(content => `
            <div style="display: flex; align-items: center; margin-bottom: 10px; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
              <input type="checkbox" value="${content.id}" id="content_${content.id}" style="margin-right: 10px;">
              <label for="content_${content.id}" style="flex: 1; cursor: pointer;">
                <strong>${this.escapeHtml(content.title)}</strong>
                <br>
                <small style="color: #666;">현재 카테고리: ${this.getCategoryDisplayName(content.category)}</small>
              </label>
            </div>
          `).join('')}
        </div>
        
        <div style="text-align: center; margin: 15px 0;">
          <button id="selectAllBtn" style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 10px;">전체 선택</button>
          <button id="deselectAllBtn" style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">전체 해제</button>
        </div>
        
        <div class="modal-actions">
          <button id="migrateBtn" style="background: #28a745; color: white;">📁 선택한 콘텐츠 이동</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">나중에 하기</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);

    // 이벤트 바인딩
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const migrateBtn = document.getElementById('migrateBtn');

    selectAllBtn.addEventListener('click', () => {
      document.querySelectorAll('#contentMigrationList input[type="checkbox"]').forEach(cb => cb.checked = true);
    });

    deselectAllBtn.addEventListener('click', () => {
      document.querySelectorAll('#contentMigrationList input[type="checkbox"]').forEach(cb => cb.checked = false);
    });

    migrateBtn.addEventListener('click', () => {
      this.migrateSelectedContents(newCategory.id);
    });
  }

  // 모든 콘텐츠 수집
  collectAllContents() {
    const contents = [];
    
    // 내부 콘텐츠
    if (window.contentInstance && window.contentInstance.contents) {
      contents.push(...window.contentInstance.contents);
    }

    // DOM의 예제 콘텐츠
    const thumbnails = document.querySelectorAll('.content-thumbnail');
    thumbnails.forEach(thumbnail => {
      const contentId = parseInt(thumbnail.dataset.contentId);
      
      // 이미 내부 콘텐츠에 있는지 확인
      if (!contents.find(c => c.id === contentId)) {
        const extractedContent = this.extractContentFromThumbnail(thumbnail, contentId);
        if (extractedContent) {
          contents.push(extractedContent);
        }
      }
    });

    return contents;
  }

  // 썸네일에서 콘텐츠 정보 추출
  extractContentFromThumbnail(thumbnail, contentId) {
    try {
      const titleElement = thumbnail.querySelector('h3');
      const contentElement = thumbnail.querySelector('div[style*="flex: 1"]');
      
      if (!titleElement) return null;

      const title = titleElement.textContent.replace('📄 ', '').trim();
      const contentText = contentElement ? contentElement.textContent.trim() : '';
      
      // 기존 카테고리 추출
      let category = 'projects'; // 기본값
      if (thumbnail.dataset.category) {
        category = thumbnail.dataset.category;
      } else {
        const categoryElement = thumbnail.querySelector('div[style*="position: absolute"]');
        if (categoryElement) {
          const categoryText = categoryElement.textContent.toLowerCase();
          if (categoryText.includes('블로그')) category = 'blog';
          else if (categoryText.includes('스터디')) category = 'study';
        }
      }

      return {
        id: contentId,
        title: title,
        category: category,
        content: contentText.replace('...', ''),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      };
    } catch (error) {
      console.error('썸네일에서 콘텐츠 추출 실패:', error);
      return null;
    }
  }

  // 선택된 콘텐츠 이동
  migrateSelectedContents(categoryId) {
    const checkedBoxes = document.querySelectorAll('#contentMigrationList input:checked');
    let migratedCount = 0;

    checkedBoxes.forEach(checkbox => {
      const contentId = parseInt(checkbox.value);
      if (this.moveContentToCategory(contentId, categoryId)) {
        migratedCount++;
      }
    });

    this.closeModal();
    
    if (migratedCount > 0) {
      this.showAlert(`${migratedCount}개의 콘텐츠가 이동되었습니다!`);
      
      // 콘텐츠 시스템에 알림
      this.notifySystemsOfCategoryChange();
      
      // 현재 보기 새로고침
      this.filterContent(this.activeCategory);
    } else {
      this.showAlert('이동할 콘텐츠를 선택해주세요.');
    }
  }

  // 콘텐츠를 카테고리로 이동
  moveContentToCategory(contentId, categoryId) {
    try {
      // 내부 콘텐츠 업데이트
      if (window.contentInstance) {
        const contentIndex = window.contentInstance.contents.findIndex(c => c.id === contentId);
        if (contentIndex > -1) {
          window.contentInstance.contents[contentIndex].category = categoryId;
          window.contentInstance.contents[contentIndex].updatedAt = new Date();
          
          // 썸네일 업데이트
          const thumbnail = document.querySelector(`[data-content-id="${contentId}"]`);
          if (thumbnail) {
            thumbnail.dataset.category = categoryId;
            window.contentInstance.updateThumbnail(window.contentInstance.contents[contentIndex]);
          }
          
          window.contentInstance.saveToStorage();
          return true;
        }
      }

      // DOM의 예제 콘텐츠 업데이트
      const thumbnail = document.querySelector(`[data-content-id="${contentId}"]`);
      if (thumbnail) {
        thumbnail.dataset.category = categoryId;
        
        // 카테고리 태그 업데이트
        const categoryTag = thumbnail.querySelector('[style*="position: absolute"]');
        const category = this.categories.get(categoryId);
        if (categoryTag && category) {
          categoryTag.style.backgroundColor = category.color;
          categoryTag.textContent = category.name.replace(/^[\p{Emoji}]\s*/u, '');
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('콘텐츠 이동 실패:', error);
      return false;
    }
  }

  // 카테고리 편집
  editCategory(categoryId) {
    const category = this.categories.get(categoryId);
    if (!category) {
      this.showAlert('편집할 카테고리를 찾을 수 없습니다.');
      return;
    }

    if (category.isDefault) {
      this.showAlert('기본 카테고리는 편집할 수 없습니다.');
      return;
    }

    // 현재 이모지와 이름 추출
    const currentName = category.name;
    const emojiMatch = currentName.match(/^(\S+)\s+(.+)$/);
    const currentEmoji = emojiMatch ? emojiMatch[1] : '📁';
    const currentText = emojiMatch ? emojiMatch[2] : currentName;

    const modalContent = `
      <div class="modal" style="width: 500px;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">카테고리 편집</div>
        
        <label>이모지:</label>
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <input type="text" id="editCategoryEmoji" value="${currentEmoji}" readonly style="
            width: 60px; 
            padding: 8px; 
            border: 1px solid #ddd; 
            border-radius: 6px; 
            text-align: center; 
            font-size: 20px;
            margin-right: 10px;
            cursor: pointer;
            background: #f8f9fa;
          ">
          <button id="editSelectEmojiBtn" style="
            background: #17a2b8; 
            color: white; 
            border: none; 
            padding: 8px 15px; 
            border-radius: 6px; 
            cursor: pointer;
            font-size: 14px;
          ">이모지 선택</button>
        </div>
        
        <label>카테고리 이름:</label>
        <input type="text" id="editCategoryName" value="${this.escapeHtml(currentText)}" placeholder="카테고리 이름을 입력하세요" style="width: 100%; box-sizing: border-box; margin-bottom: 12px;">
        
        <label>색상:</label>
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <input type="color" id="editCategoryColor" value="${category.color}" style="width: 50px; height: 35px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px;">
          <button id="editRandomColorBtn" style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">랜덤 색상</button>
        </div>
        
        <div style="font-size: 12px; color: #666; margin-bottom: 20px;">
          미리보기: <span id="editCategoryPreview" style="font-weight: bold; padding: 4px 8px; border-radius: 12px; color: white; background: ${category.color};">${currentName}</span>
        </div>
        
        <div class="modal-actions">
          <button id="saveEditCategoryBtn" style="background: #28a745; color: white;">💾 저장</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">❌ 취소</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);

    const emojiInput = document.getElementById('editCategoryEmoji');
    const nameInput = document.getElementById('editCategoryName');
    const colorInput = document.getElementById('editCategoryColor');
    const preview = document.getElementById('editCategoryPreview');
    const selectEmojiBtn = document.getElementById('editSelectEmojiBtn');
    const randomColorBtn = document.getElementById('editRandomColorBtn');
    const saveBtn = document.getElementById('saveEditCategoryBtn');

    // 미리보기 업데이트
    const updatePreview = () => {
      const emoji = emojiInput.value || '📁';
      const name = nameInput.value || '새 카테고리';
      const color = colorInput.value;
      preview.textContent = `${emoji} ${name}`;
      preview.style.backgroundColor = color;
    };

    // 이벤트 리스너들
    nameInput.addEventListener('input', updatePreview);
    colorInput.addEventListener('input', updatePreview);
    
    // 이모지 선택 버튼 이벤트 (개선된 방식)
    selectEmojiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      this.showEmojiPicker((selectedEmoji) => {
        emojiInput.value = selectedEmoji;
        updatePreview();
      });
    });

    // 이모지 입력창 클릭 이벤트
    emojiInput.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      this.showEmojiPicker((selectedEmoji) => {
        emojiInput.value = selectedEmoji;
        updatePreview();
      });
    });

    randomColorBtn.addEventListener('click', () => {
      colorInput.value = this.getRandomColor();
      updatePreview();
    });

    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const emoji = emojiInput.value.trim();
      const name = nameInput.value.trim();
      const color = colorInput.value;

      if (!name) {
        this.showAlert('카테고리 이름을 입력해주세요.');
        return;
      }

      const newName = `${emoji} ${name}`;
      
      // 카테고리 업데이트
      category.name = newName;
      category.color = color;
      category.keywords = this.generateKeywords(newName);
      category.updatedAt = new Date();
      
      // DOM 업데이트
      const tabElement = this.categoryContainer.querySelector(`[data-category="${categoryId}"]`);
      if (tabElement) {
        tabElement.textContent = newName;
      }

      // 썸네일들의 카테고리 태그 업데이트
      this.updateCategoryTagsInThumbnails(categoryId, category);

      this.saveToStorage();
      this.notifySystemsOfCategoryChange();
      this.closeModal();
      this.showAlert('카테고리가 수정되었습니다!');
    });

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBtn.click();
      }
    });

    nameInput.focus();
    nameInput.select();
  }

  // 썸네일의 카테고리 태그 업데이트
  updateCategoryTagsInThumbnails(categoryId, category) {
    const thumbnails = document.querySelectorAll(`[data-category="${categoryId}"]`);
    thumbnails.forEach(thumbnail => {
      const categoryTag = thumbnail.querySelector('[style*="position: absolute"]');
      if (categoryTag) {
        categoryTag.style.backgroundColor = category.color;
        categoryTag.textContent = category.name.replace(/^[\p{Emoji}]\s*/u, '');
      }
    });
  }

  // 카테고리 삭제
  deleteCategory(categoryId) {
    const category = this.categories.get(categoryId);
    if (!category) {
      this.showAlert('삭제할 카테고리를 찾을 수 없습니다.');
      return;
    }

    if (category.isDefault) {
      this.showAlert('기본 카테고리는 삭제할 수 없습니다.');
      return;
    }

    // 해당 카테고리의 콘텐츠 개수 확인
    const contentCount = this.getContentCountByCategory(categoryId);
    
    let confirmMessage = `'${category.name}' 카테고리를 삭제하시겠습니까?`;
    if (contentCount > 0) {
      confirmMessage += `\n\n이 카테고리에 속한 ${contentCount}개의 콘텐츠는 '프로젝트' 카테고리로 이동됩니다.`;
    }
    
    this.showConfirm(confirmMessage, () => {
      // 카테고리에 속한 콘텐츠들을 기본 카테고리로 이동
      if (contentCount > 0) {
        this.moveAllContentsFromCategory(categoryId, 'projects');
      }

      // DOM에서 제거
      const tabToDelete = this.categoryContainer.querySelector(`[data-category="${categoryId}"]`);
      if (tabToDelete) {
        tabToDelete.remove();
      }

      // Map에서 제거
      this.categories.delete(categoryId);

      // 삭제된 카테고리가 현재 활성 카테고리인 경우 전체로 변경
      if (this.activeCategory === categoryId) {
        this.selectCategory('all');
      }

      this.saveToStorage();
      this.notifySystemsOfCategoryChange();
      this.showAlert('카테고리가 삭제되었습니다.');
    });
  }

  // 카테고리별 콘텐츠 개수 조회
  getContentCountByCategory(categoryId) {
    let count = 0;
    
    // 내부 콘텐츠 확인
    if (window.contentInstance && window.contentInstance.contents) {
      count += window.contentInstance.contents.filter(content => content.category === categoryId).length;
    }

    // DOM의 예제 콘텐츠 확인
    const thumbnails = document.querySelectorAll(`[data-category="${categoryId}"]`);
    count += thumbnails.length;

    return count;
  }

  // 카테고리의 모든 콘텐츠를 다른 카테고리로 이동
  moveAllContentsFromCategory(fromCategoryId, toCategoryId) {
    // 내부 콘텐츠 이동
    if (window.contentInstance && window.contentInstance.contents) {
      window.contentInstance.contents.forEach(content => {
        if (content.category === fromCategoryId) {
          content.category = toCategoryId;
          content.updatedAt = new Date();
        }
      });
      window.contentInstance.saveToStorage();
    }

    // DOM 콘텐츠 이동
    const thumbnails = document.querySelectorAll(`[data-category="${fromCategoryId}"]`);
    thumbnails.forEach(thumbnail => {
      thumbnail.dataset.category = toCategoryId;
      
      // 카테고리 태그 업데이트
      const categoryTag = thumbnail.querySelector('[style*="position: absolute"]');
      const toCategory = this.categories.get(toCategoryId);
      if (categoryTag && toCategory) {
        categoryTag.style.backgroundColor = toCategory.color;
        categoryTag.textContent = toCategory.name.replace(/^[\p{Emoji}]\s*/u, '');
      }
    });
  }

  // 컨텍스트 메뉴 표시
  showCategoryContextMenu(categoryId, x, y) {
    if (categoryId === 'all') {
      return; // 전체 카테고리는 컨텍스트 메뉴 없음
    }

    const category = this.categories.get(categoryId);
    const isDefault = category ? category.isDefault : false;

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
      min-width: 140px;
      overflow: hidden;
    `;

    const menuItems = [];
    
    if (!isDefault) {
      menuItems.push(
        { 
          text: '✏️ 카테고리 편집', 
          action: () => this.editCategory(categoryId),
          color: '#007bff'
        },
        { 
          text: '🗑️ 카테고리 삭제', 
          action: () => this.deleteCategory(categoryId),
          color: '#dc3545'
        }
      );
    } else {
      menuItems.push({
        text: '🔒 기본 카테고리',
        action: () => this.showAlert('기본 카테고리는 편집할 수 없습니다.'),
        color: '#6c757d'
      });
    }

    menuItems.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.textContent = item.text;
      menuItem.style.cssText = `
        padding: 10px 15px;
        cursor: pointer;
        font-size: 14px;
        color: ${item.color};
        transition: background-color 0.2s;
        ${index < menuItems.length - 1 ? 'border-bottom: 1px solid #f0f0f0;' : ''}
      `;

      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = '#f8f9fa';
      });

      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = '';
      });

      menuItem.addEventListener('click', () => {
        item.action();
        contextMenu.remove();
      });

      contextMenu.appendChild(menuItem);
    });

    document.body.appendChild(contextMenu);

    // 바깥 클릭 시 메뉴 닫기
    setTimeout(() => {
      document.addEventListener('click', function closeMenu() {
        contextMenu.remove();
        document.removeEventListener('click', closeMenu);
      });
    }, 10);
  }

  // 이모지 선택 모달 (개선된 버전)
  showEmojiPicker(callback) {
    // 기존 이모지 모달이 있으면 제거
    const existingEmojiModal = document.querySelector('.emoji-picker-modal');
    if (existingEmojiModal) {
      existingEmojiModal.remove();
    }

    const modalContent = `
      <div class="modal emoji-picker-modal" style="width: 600px; max-height: 80vh; overflow: hidden;">
        <button class="modal-close-btn emoji-close-btn">&times;</button>
        <div class="modal-title">이모지 선택</div>
        
        <div style="margin-bottom: 15px;">
          <input type="text" id="emojiSearch" placeholder="이모지 검색..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
        </div>
        
        <div id="emojiGrid" style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
          padding: 10px;
          border: 1px solid #eee;
          border-radius: 6px;
          background: #fafafa;
        ">
          ${this.emojiList.map(emoji => `
            <div class="emoji-item" style="
              width: 50px;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              cursor: pointer;
              border-radius: 8px;
              transition: all 0.2s;
              background: white;
              border: 2px solid transparent;
            " data-emoji="${emoji}">
              ${emoji}
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
          <div style="font-size: 14px; color: #666; margin-bottom: 10px;">또는 직접 입력:</div>
          <input type="text" id="customEmoji" placeholder="💡" style="width: 100px; padding: 8px; border: 1px solid #ddd; border-radius: 6px; text-align: center; font-size: 20px;">
        </div>
        
        <div class="modal-actions">
          <button id="selectEmojiBtn" style="background: #007bff; color: white;" disabled>✅ 선택</button>
          <button id="cancelEmojiBtn" style="background: #6c757d; color: white;">❌ 취소</button>
        </div>
      </div>
    `;

    // 이모지 선택 전용 모달 표시 (기존 모달 위에 겹쳐서)
    this.showEmojiModal(modalContent, callback);
  }

  // 이모지 전용 모달 표시 (모달 중첩 지원)
  showEmojiModal(content, callback) {
    const backdrop = document.createElement('div');
    backdrop.className = "emoji-modal-backdrop";
    backdrop.style.cssText = `
      position: fixed;
      left: 0; 
      top: 0; 
      right: 0; 
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(2px);
    `;
    backdrop.innerHTML = content;
    document.body.appendChild(backdrop);

    // 이벤트 바인딩
    setTimeout(() => {
      this.bindEmojiModalEvents(backdrop, callback);
    }, 50);

    // 바깥 클릭 시 닫기
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        this.closeEmojiModal();
      }
    });

    return backdrop;
  }

  // 이모지 모달 이벤트 바인딩
  bindEmojiModalEvents(modalElement, callback) {
    const emojiGrid = modalElement.querySelector('#emojiGrid');
    const selectBtn = modalElement.querySelector('#selectEmojiBtn');
    const cancelBtn = modalElement.querySelector('#cancelEmojiBtn');
    const customEmoji = modalElement.querySelector('#customEmoji');
    const searchInput = modalElement.querySelector('#emojiSearch');
    const closeBtn = modalElement.querySelector('.emoji-close-btn');
    
    let selectedEmoji = '';

    if (!emojiGrid || !selectBtn || !customEmoji || !searchInput) {
      console.error('이모지 모달 요소를 찾을 수 없습니다.');
      return;
    }

    // 이모지 그리드 클릭 이벤트
    emojiGrid.addEventListener('click', (e) => {
      const emojiItem = e.target.closest('.emoji-item');
      if (emojiItem) {
        // 이전 선택 해제
        modalElement.querySelectorAll('.emoji-item').forEach(item => {
          item.style.borderColor = 'transparent';
          item.style.backgroundColor = 'white';
        });

        // 새 선택 적용
        emojiItem.style.borderColor = '#007bff';
        emojiItem.style.backgroundColor = '#e3f2fd';
        
        selectedEmoji = emojiItem.dataset.emoji;
        customEmoji.value = selectedEmoji;
        selectBtn.disabled = false;
        selectBtn.style.opacity = '1';
      }
    });

    // 커스텀 이모지 입력 이벤트
    customEmoji.addEventListener('input', (e) => {
      selectedEmoji = e.target.value.trim();
      selectBtn.disabled = !selectedEmoji;
      selectBtn.style.opacity = selectedEmoji ? '1' : '0.5';
      
      // 그리드 선택 해제
      modalElement.querySelectorAll('.emoji-item').forEach(item => {
        item.style.borderColor = 'transparent';
        item.style.backgroundColor = 'white';
      });
    });

    // 검색 기능
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const emojiItems = modalElement.querySelectorAll('.emoji-item');
      
      emojiItems.forEach(item => {
        const emoji = item.dataset.emoji;
        const emojiName = this.getEmojiName(emoji);
        const isVisible = searchTerm === '' || emojiName.includes(searchTerm);
        item.style.display = isVisible ? 'flex' : 'none';
      });
    });

    // 선택 버튼 이벤트
    selectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (selectedEmoji && callback) {
        try {
          callback(selectedEmoji);
          this.closeEmojiModal();
        } catch (error) {
          console.error('이모지 콜백 실행 오류:', error);
          this.closeEmojiModal();
        }
      }
    });

    // 취소 버튼 이벤트
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeEmojiModal();
    });

    // 닫기 버튼 이벤트
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeEmojiModal();
    });

    // Enter 키로 선택
    customEmoji.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && selectedEmoji) {
        e.preventDefault();
        selectBtn.click();
      }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', this.handleEmojiEscKey.bind(this));

    // 이모지 호버 효과
    emojiGrid.addEventListener('mouseover', (e) => {
      const emojiItem = e.target.closest('.emoji-item');
      if (emojiItem && emojiItem.style.borderColor !== 'rgb(0, 123, 255)') {
        emojiItem.style.backgroundColor = '#f0f0f0';
      }
    });

    emojiGrid.addEventListener('mouseout', (e) => {
      const emojiItem = e.target.closest('.emoji-item');
      if (emojiItem && emojiItem.style.borderColor !== 'rgb(0, 123, 255)') {
        emojiItem.style.backgroundColor = 'white';
      }
    });

    // 검색 입력창에 포커스
    setTimeout(() => {
      searchInput.focus();
    }, 100);
  }

  // 이모지 모달 ESC 키 핸들러
  handleEmojiEscKey(e) {
    if (e.key === 'Escape') {
      const emojiModal = document.querySelector('.emoji-modal-backdrop');
      if (emojiModal) {
        e.preventDefault();
        e.stopPropagation();
        this.closeEmojiModal();
      }
    }
  }

  // 이모지 모달 닫기
  closeEmojiModal() {
    const emojiModal = document.querySelector('.emoji-modal-backdrop');
    if (emojiModal) {
      // ESC 키 이벤트 리스너 제거
      document.removeEventListener('keydown', this.handleEmojiEscKey.bind(this));
      
      // 페이드 아웃 효과
      emojiModal.style.opacity = '0';
      emojiModal.style.transition = 'opacity 0.2s ease-out';
      
      setTimeout(() => {
        if (emojiModal.parentNode) {
          emojiModal.remove();
        }
      }, 200);
    }
  }

  // 이모지 이름 반환 (검색용)
  getEmojiName(emoji) {
    const emojiNames = {
      '📚': 'books 책 book',
      '💻': 'computer 컴퓨터 laptop',
      '📝': 'memo 메모 note 노트',
      '📖': 'book 책 read 읽기',
      '🎯': 'target 타겟 goal 목표',
      '🚀': 'rocket 로켓 launch 발사',
      '⚡': 'lightning 번개 fast 빠른',
      '🔥': 'fire 불 hot 뜨거운',
      '💡': 'bulb 전구 idea 아이디어',
      '🎨': 'art 예술 paint 그림',
      '🎵': 'music 음악 note 노트',
      '🎮': 'game 게임 controller 컨트롤러',
      '📱': 'phone 폰 mobile 모바일',
      '🖥️': 'desktop 데스크탑 monitor 모니터',
      '⌚': 'watch 시계 time 시간',
      '📷': 'camera 카메라 photo 사진'
    };
    
    return emojiNames[emoji] || '';
  }

  // 유틸리티 메서드들
  getAllCategories() {
    return Array.from(this.categories.values());
  }

  getCategoryMap() {
    return this.categories;
  }

  getCategoryById(categoryId) {
    return this.categories.get(categoryId);
  }

  getCategoryDisplayName(categoryId) {
    const category = this.categories.get(categoryId);
    return category ? category.name : categoryId;
  }

  getActiveCategory() {
    return this.activeCategory;
  }

  getCategoryColor(categoryId) {
    const category = this.categories.get(categoryId);
    return category ? category.color : '#28a745';
  }

  // HTML 이스케이프
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 로컬스토리지에 저장
  saveToStorage() {
    try {
      const categoryData = {
        categories: Array.from(this.categories.entries()),
        activeCategory: this.activeCategory,
        version: '2.0' // 버전 정보 추가
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
        
        // 버전 호환성 확인
        if (categoryData.version === '2.0' && categoryData.categories) {
          // 새 버전 형식: Map 엔트리 배열
          this.categories.clear();
          
          // 기본 카테고리 먼저 추가
          this.defaultCategories.forEach(defaultCat => {
            this.categories.set(defaultCat.id, {
              ...defaultCat,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01')
            });
          });
          
          // 저장된 커스텀 카테고리 추가
          categoryData.categories.forEach(([id, category]) => {
            if (!category.isDefault) {
              this.categories.set(id, {
                ...category,
                createdAt: new Date(category.createdAt),
                updatedAt: new Date(category.updatedAt)
              });
            }
          });
        } else if (categoryData.categories) {
          // 구 버전 형식: 배열
          this.migrateOldFormat(categoryData);
        }
        
        // 활성 카테고리 복원
        if (categoryData.activeCategory && this.categories.has(categoryData.activeCategory)) {
          this.activeCategory = categoryData.activeCategory;
        } else {
          this.activeCategory = 'all';
        }
        
        // DOM 업데이트
        this.updateCategoryTabs();
      }
    } catch (error) {
      console.error('카테고리 설정 로드 실패:', error);
      this.activeCategory = 'all';
    }
  }

  // 구 버전 데이터 마이그레이션
  migrateOldFormat(categoryData) {
    // 기본 카테고리 유지
    this.initializeCategories();
    
    // 구 버전의 커스텀 카테고리 변환
    categoryData.categories.forEach(oldCategory => {
      if (oldCategory.id !== 'all' && !oldCategory.isDefault) {
        const newCategory = {
          id: oldCategory.id,
          name: oldCategory.name,
          color: oldCategory.color || this.getRandomColor(),
          keywords: this.generateKeywords(oldCategory.name),
          isDefault: false,
          createdAt: new Date(oldCategory.createdAt || new Date()),
          updatedAt: new Date(oldCategory.updatedAt || new Date())
        };
        this.categories.set(oldCategory.id, newCategory);
      }
    });
    
    // 새 형식으로 저장
    this.saveToStorage();
  }

  // 카테고리 탭 DOM 업데이트
  updateCategoryTabs() {
    if (!this.categoryContainer) return;
    
    // 기존 커스텀 탭들 제거
    const existingTabs = this.categoryContainer.querySelectorAll('.category-tab');
    existingTabs.forEach(tab => {
      const categoryId = tab.dataset.category;
      const category = this.categories.get(categoryId);
      if (!category || !category.isDefault) {
        tab.remove();
      }
    });
    
    // 커스텀 카테고리 탭 추가
    const addBtn = this.categoryContainer.querySelector('.add-category-btn');
    this.categories.forEach(category => {
      if (!category.isDefault) {
        const newTab = document.createElement('div');
        newTab.className = 'category-tab';
        newTab.dataset.category = category.id;
        newTab.textContent = category.name;
        
        if (addBtn) {
          this.categoryContainer.insertBefore(newTab, addBtn);
        } else {
          this.categoryContainer.appendChild(newTab);
        }
      }
    });
    
    // 활성 카테고리 표시
    this.selectCategory(this.activeCategory);
  }

  // 헬퍼 함수들 (전역 함수 의존성 제거)
  showModal(content) {
    if (typeof showModal === 'function') {
      showModal(content);
    } else {
      // showModal 함수가 없는 경우 대체 구현
      const existingModal = document.querySelector('.modal-overlay');
      if (existingModal) existingModal.remove();

      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;
      
      overlay.innerHTML = content;
      document.body.appendChild(overlay);
      
      // 오버레이 클릭시 모달 닫기
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal();
        }
      });
    }
  }

  closeModal() {
    if (typeof closeModal === 'function') {
      closeModal();
    } else {
      const modal = document.querySelector('.modal-overlay');
      if (modal) {
        modal.remove();
      }
    }
  }

  showAlert(message) {
    if (typeof showAlert === 'function') {
      showAlert(message);
    } else {
      alert(message);
    }
  }

  showConfirm(message, callback) {
    if (typeof showConfirm === 'function') {
      showConfirm(message, callback);
    } else {
      if (confirm(message)) {
        callback();
      }
    }
  }

  // 초기화
  init() {
    this.loadFromStorage();
    
    // 콘텐츠 모듈에서 카테고리 업데이트 이벤트 수신
    document.addEventListener('category:request', () => {
      this.notifySystemsOfCategoryChange();
    });
  }

  // 정리 작업
  cleanup() {
    this.saveToStorage();
  }
}

// 전역 함수들 (HTML에서 호출되는 함수들)
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