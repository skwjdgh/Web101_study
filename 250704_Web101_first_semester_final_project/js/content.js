// ====== 개선된 콘텐츠 모듈 (마크다운 지원) ======
class Content {
  constructor() {
    this.contentArea = null;
    this.contents = [];
    this.nextId = 1;
    this.isEditing = false;
    this.markdownLoaded = false;
    this.categoryMap = new Map(); // 카테고리 정보 캐시
    
    this.initElements();
    this.bindEvents();
    this.loadMarkdownLibrary();
    this.setupCategoryEventListeners();
  }

  // 카테고리 이벤트 리스너 설정
  setupCategoryEventListeners() {
    // 카테고리 업데이트 이벤트 수신
    document.addEventListener('category:updated', (e) => {
      this.onCategoryUpdated(e.detail.categories, e.detail.categoryMap);
    });
  }

  // 카테고리 업데이트 처리
  onCategoryUpdated(categories, categoryMap) {
    console.log('📢 카테고리 업데이트 수신:', categories.length, '개 카테고리');
    
    // 카테고리 맵 업데이트
    this.categoryMap = categoryMap || new Map();
    
    // 모든 카테고리 선택 옵션 업데이트
    this.updateAllCategorySelects(categories);
    
    // 썸네일들의 카테고리 표시 업데이트
    this.refreshAllThumbnails();
  }

  // 모든 카테고리 선택 옵션 업데이트
  updateAllCategorySelects(categories) {
    const selects = document.querySelectorAll('#contentCategory, #editContentCategory');
    
    selects.forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '';
      
      categories.forEach(category => {
        if (category.id !== 'all') {
          const option = document.createElement('option');
          option.value = category.id;
          option.textContent = category.name;
          select.appendChild(option);
        }
      });
      
      // 이전 선택값 복원 (가능한 경우)
      if (currentValue && select.querySelector(`option[value="${currentValue}"]`)) {
        select.value = currentValue;
      }
    });
  }

  // 모든 썸네일 새로고침
  refreshAllThumbnails() {
    this.contents.forEach(content => {
      const thumbnail = document.querySelector(`[data-content-id="${content.id}"]`);
      if (thumbnail) {
        this.updateThumbnailCategoryDisplay(thumbnail, content);
      }
    });
  }

  // 썸네일의 카테고리 표시 업데이트
  updateThumbnailCategoryDisplay(thumbnail, content) {
    const categoryTag = thumbnail.querySelector('[style*="position: absolute"]');
    if (!categoryTag) return;

    const category = this.getCategoryInfo(content.category);
    if (category) {
      categoryTag.style.backgroundColor = category.color;
      categoryTag.textContent = category.name.replace(/^[\p{Emoji}]\s*/u, '');
    }
  }

  // 카테고리 정보 조회
  getCategoryInfo(categoryId) {
    // 카테고리 인스턴스에서 직접 조회
    if (window.categoryInstance) {
      return window.categoryInstance.getCategoryById(categoryId);
    }
    
    // 캐시된 정보 사용
    if (this.categoryMap && this.categoryMap.has(categoryId)) {
      return this.categoryMap.get(categoryId);
    }
    
    // 기본값 반환
    const defaultCategories = {
      'projects': { name: '💻 프로젝트', color: '#007bff' },
      'blog': { name: '📝 블로그', color: '#dc3545' },
      'study': { name: '📖 스터디', color: '#ffc107' }
    };
    
    return defaultCategories[categoryId] || { name: categoryId, color: '#28a745' };
  }

  // 마크다운 라이브러리 로드
  loadMarkdownLibrary() {
    if (typeof marked === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js';
      script.onload = () => {
        if (typeof marked !== 'undefined') {
          marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: false,
            mangle: false
          });
          this.markdownLoaded = true;
          console.log('✅ 마크다운 라이브러리 로드 완료');
        }
      };
      script.onerror = () => {
        console.warn('⚠️ 마크다운 라이브러리 로드 실패');
        this.markdownLoaded = false;
      };
      document.head.appendChild(script);
    } else {
      this.markdownLoaded = true;
    }
  }

  // 마크다운을 HTML로 변환
  parseMarkdown(markdown) {
    if (!markdown) return '';
    if (this.markdownLoaded && typeof marked !== 'undefined') {
      try {
        return marked.parse(markdown);
      } catch (error) {
        console.error('마크다운 파싱 오류:', error);
        return this.escapeHtml(markdown).replace(/\n/g, '<br>');
      }
    }
    // 마크다운 라이브러리가 로드되지 않은 경우 기본 텍스트 반환
    return this.escapeHtml(markdown).replace(/\n/g, '<br>');
  }

  // DOM 요소 초기화
  initElements() {
    this.contentArea = document.getElementById('contentArea');
  }

  // 이벤트 바인딩
  bindEvents() {
    if (this.contentArea) {
      // 더블클릭으로 새 콘텐츠 추가
      this.contentArea.addEventListener('dblclick', (e) => {
        if (!e.target.closest('.content-thumbnail')) {
          this.showAddContentModal();
        }
      });

      // 우클릭 컨텍스트 메뉴
      this.contentArea.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // 썸네일 위에서 우클릭한 경우
        const thumbnail = e.target.closest('.content-thumbnail');
        if (thumbnail) {
          const contentId = parseInt(thumbnail.dataset.contentId);
          this.showThumbnailContextMenu(contentId, e.clientX, e.clientY);
        } else {
          // 빈 공간에서 우클릭한 경우
          this.showContextMenu(e.clientX, e.clientY);
        }
      });
    }
  }

  // 새 콘텐츠 추가 모달 (개선된 카테고리 선택)
  showAddContentModal() {
    // 카테고리 정보 요청
    if (window.categoryInstance) {
      const categories = window.categoryInstance.getAllCategories();
      this.renderAddContentModal(categories);
    } else {
      // 카테고리 인스턴스가 없는 경우 기본 카테고리 사용
      const defaultCategories = [
        { id: 'projects', name: '💻 프로젝트' },
        { id: 'blog', name: '📝 블로그' },
        { id: 'study', name: '📖 스터디' }
      ];
      this.renderAddContentModal(defaultCategories);
    }
  }

  // 콘텐츠 추가 모달 렌더링
  renderAddContentModal(categories) {
    const categoryOptions = categories
      .filter(cat => cat.id !== 'all')
      .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
      .join('');

    const modalContent = `
      <div class="modal" style="width: 1000px; max-width: 90vw; height: 80vh; display: flex; flex-direction: column;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">새 내용 추가</div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">제목:</label>
          <input type="text" id="contentTitle" placeholder="제목을 입력하세요" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">카테고리:</label>
          <select id="contentCategory" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px;">
            ${categoryOptions}
          </select>
        </div>
        
        <div style="flex: 1; display: flex; flex-direction: column; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <label style="font-weight: bold;">내용 (마크다운 지원):</label>
            <div style="display: flex; gap: 10px;">
              <button type="button" onclick="window.contentInstance.toggleMarkdownView('split')" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 12px;">📋 분할 보기</button>
              <button type="button" onclick="window.contentInstance.toggleMarkdownView('edit')" style="padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 12px;">✏️ 편집 모드</button>
              <button type="button" onclick="window.contentInstance.toggleMarkdownView('preview')" style="padding: 5px 10px; background: #6f42c1; color: white; border: none; border-radius: 4px; font-size: 12px;">👁️ 미리보기</button>
            </div>
          </div>
          
          <div id="markdownContainer" style="flex: 1; display: flex; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
            <div id="markdownEditor" style="flex: 1; display: flex; flex-direction: column;">
              <div style="background: #f8f9fa; padding: 8px 12px; border-bottom: 1px solid #ddd; font-size: 12px; font-weight: bold; color: #666;">
                📝 마크다운 편집기
              </div>
              <textarea id="contentBody" placeholder="마크다운으로 내용을 작성하세요...&#10;&#10;# 제목&#10;## 부제목&#10;**굵은 글씨**&#10;*기울임*&#10;- 목록 항목&#10;[링크](URL)&#10;![이미지](URL)" 
                style="flex: 1; padding: 12px; border: none; resize: none; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; outline: none;"></textarea>
            </div>
            
            <div id="markdownPreview" style="flex: 1; display: flex; flex-direction: column; border-left: 1px solid #ddd;">
              <div style="background: #f8f9fa; padding: 8px 12px; border-bottom: 1px solid #ddd; font-size: 12px; font-weight: bold; color: #666;">
                👁️ 미리보기
              </div>
              <div id="previewContent" style="flex: 1; padding: 12px; overflow-y: auto; background: white; line-height: 1.6;"></div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button onclick="window.contentInstance.saveNewContent()" style="background: #007bff; color: white;">✅ 저장</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">❌ 취소</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);
    
    // 마크다운 에디터 초기화
    setTimeout(() => {
      this.initMarkdownEditor();
    }, 100);
  }

  // 마크다운 편집기 초기화
  initMarkdownEditor() {
    const textarea = document.getElementById('contentBody');
    const previewContent = document.getElementById('previewContent');
    
    if (textarea && previewContent) {
      textarea.addEventListener('input', () => {
        this.updateMarkdownPreview();
      });
      
      // 초기 미리보기 업데이트
      this.updateMarkdownPreview();
    }
  }

  // 마크다운 미리보기 업데이트
  updateMarkdownPreview() {
    const textarea = document.getElementById('contentBody');
    const previewContent = document.getElementById('previewContent');
    
    if (textarea && previewContent) {
      const markdown = textarea.value;
      const html = this.parseMarkdown(markdown);
      previewContent.innerHTML = html;
    }
  }

  // 마크다운 보기 모드 전환
  toggleMarkdownView(mode) {
    const editor = document.getElementById('markdownEditor');
    const preview = document.getElementById('markdownPreview');
    
    if (!editor || !preview) return;
    
    switch (mode) {
      case 'split':
        editor.style.display = 'flex';
        editor.style.flex = '1';
        preview.style.display = 'flex';
        preview.style.flex = '1';
        break;
      case 'edit':
        editor.style.display = 'flex';
        editor.style.flex = '1';
        preview.style.display = 'none';
        break;
      case 'preview':
        editor.style.display = 'none';
        preview.style.display = 'flex';
        preview.style.flex = '1';
        break;
    }
    
    this.updateMarkdownPreview();
  }

  // 새 콘텐츠 저장
  saveNewContent() {
    const titleInput = document.getElementById('contentTitle');
    const categorySelect = document.getElementById('contentCategory');
    const bodyTextarea = document.getElementById('contentBody');

    if (!titleInput || !categorySelect || !bodyTextarea) {
      this.showAlert('입력 요소를 찾을 수 없습니다.');
      return;
    }

    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const body = bodyTextarea.value.trim();

    if (!title || !body) {
      this.showAlert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 새 콘텐츠 객체 생성
    const newContent = {
      id: this.nextId++,
      title: title,
      category: category,
      content: body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 배열에 추가
    this.contents.unshift(newContent); // 최신 항목을 앞에 추가

    // 썸네일 생성 (개선된 방식)
    this.createThumbnail(newContent);

    // 데이터 저장
    this.saveToStorage();

    this.closeModal();
    this.showAlert('새 콘텐츠가 추가되었습니다!');
    
    // 카테고리 필터링 새로고침
    if (window.categoryInstance) {
      window.categoryInstance.filterContent(window.categoryInstance.getActiveCategory());
    }
  }

  // 개선된 썸네일 생성 (동적 카테고리 지원)
  createThumbnail(content) {
    const category = this.getCategoryInfo(content.category);
    
    const thumbnail = document.createElement('div');
    thumbnail.className = 'content-thumbnail';
    thumbnail.dataset.contentId = content.id;
    thumbnail.dataset.category = content.category; // 중요: 데이터 속성으로 카테고리 저장
    thumbnail.onclick = () => this.showContentModal(content);

    const timeAgo = this.getTimeAgo(content.updatedAt);
    
    // 마크다운을 HTML로 변환한 후 텍스트만 추출하여 미리보기 생성
    const htmlContent = this.parseMarkdown(content.content);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    const preview = textContent.substring(0, 150);

    thumbnail.innerHTML = `
      <div style="position: absolute; top: 15px; right: 15px; background: ${category.color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
        ${category.name.replace(/^[\p{Emoji}]\s*/u, '')}
      </div>
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px; font-weight: bold; line-height: 1.3;">
        📄 ${this.escapeHtml(content.title)}
      </h3>
      <div style="flex: 1; color: #666; font-size: 14px; line-height: 1.5; overflow: hidden; margin-bottom: 15px;">
        ${this.escapeHtml(preview)}${preview.length >= 150 ? '...' : ''}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
        <div>
          <span style="margin-right: 15px;">📅 생성: ${this.formatDate(content.createdAt)}</span>
          <span>✏️ 수정: ${this.formatDate(content.updatedAt)}</span>
        </div>
        <div style="background: #28a745; color: white; padding: 3px 8px; border-radius: 10px; font-weight: bold;">
          ${timeAgo}
        </div>
      </div>
    `;

    // 첫 번째 썸네일 앞에 삽입 (헤더 다음)
    const headerSection = this.contentArea.querySelector('div[style*="margin-bottom: 20px"]');
    const firstThumbnail = this.contentArea.querySelector('.content-thumbnail');
    
    if (firstThumbnail) {
      firstThumbnail.parentNode.insertBefore(thumbnail, firstThumbnail);
    } else if (headerSection) {
      headerSection.parentNode.insertBefore(thumbnail, headerSection.nextSibling);
    } else {
      this.contentArea.appendChild(thumbnail);
    }
  }

  // 썸네일 업데이트 (개선된 방식)
  updateThumbnail(content) {
    const existingThumbnail = document.querySelector(`[data-content-id="${content.id}"]`);
    if (existingThumbnail) {
      existingThumbnail.remove();
    }
    this.createThumbnail(content);
  }

  // 콘텐츠 편집 모달 (개선된 카테고리 선택)
  showEditContentModal(content) {
    // 카테고리 정보 요청
    const categories = window.categoryInstance ? 
      window.categoryInstance.getAllCategories() : 
      [
        { id: 'projects', name: '💻 프로젝트' },
        { id: 'blog', name: '📝 블로그' },
        { id: 'study', name: '📖 스터디' }
      ];

    const categoryOptions = categories
      .filter(cat => cat.id !== 'all')
      .map(cat => `<option value="${cat.id}" ${content.category === cat.id ? 'selected' : ''}>${cat.name}</option>`)
      .join('');

    const modalContent = `
      <div class="modal" style="width: 1000px; max-width: 90vw; height: 80vh; display: flex; flex-direction: column;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">내용 편집</div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">제목:</label>
          <input type="text" id="editContentTitle" value="${this.escapeHtml(content.title)}" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">카테고리:</label>
          <select id="editContentCategory" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px;">
            ${categoryOptions}
          </select>
        </div>
        
        <div style="flex: 1; display: flex; flex-direction: column; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <label style="font-weight: bold;">내용 (마크다운 지원):</label>
            <div style="display: flex; gap: 10px;">
              <button type="button" onclick="window.contentInstance.toggleEditMarkdownView('split')" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 12px;">📋 분할 보기</button>
              <button type="button" onclick="window.contentInstance.toggleEditMarkdownView('edit')" style="padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 12px;">✏️ 편집 모드</button>
              <button type="button" onclick="window.contentInstance.toggleEditMarkdownView('preview')" style="padding: 5px 10px; background: #6f42c1; color: white; border: none; border-radius: 4px; font-size: 12px;">👁️ 미리보기</button>
            </div>
          </div>
          
          <div id="editMarkdownContainer" style="flex: 1; display: flex; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
            <div id="editMarkdownEditor" style="flex: 1; display: flex; flex-direction: column;">
              <div style="background: #f8f9fa; padding: 8px 12px; border-bottom: 1px solid #ddd; font-size: 12px; font-weight: bold; color: #666;">
                📝 마크다운 편집기
              </div>
              <textarea id="editContentBody" style="flex: 1; padding: 12px; border: none; resize: none; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5; outline: none;">${this.escapeHtml(content.content)}</textarea>
            </div>
            
            <div id="editMarkdownPreview" style="flex: 1; display: flex; flex-direction: column; border-left: 1px solid #ddd;">
              <div style="background: #f8f9fa; padding: 8px 12px; border-bottom: 1px solid #ddd; font-size: 12px; font-weight: bold; color: #666;">
                👁️ 미리보기
              </div>
              <div id="editPreviewContent" style="flex: 1; padding: 12px; overflow-y: auto; background: white; line-height: 1.6;"></div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button onclick="window.contentInstance.saveEditedContent(${content.id})" style="background: #28a745; color: white;">💾 저장</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">❌ 취소</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);
    
    // 편집 모드 마크다운 에디터 초기화
    setTimeout(() => {
      this.initEditMarkdownEditor();
    }, 100);
  }

  // 편집 모드 마크다운 편집기 초기화
  initEditMarkdownEditor() {
    const textarea = document.getElementById('editContentBody');
    const previewContent = document.getElementById('editPreviewContent');
    
    if (textarea && previewContent) {
      textarea.addEventListener('input', () => {
        this.updateEditMarkdownPreview();
      });
      
      // 초기 미리보기 업데이트
      this.updateEditMarkdownPreview();
    }
  }

  // 편집 모드 마크다운 미리보기 업데이트
  updateEditMarkdownPreview() {
    const textarea = document.getElementById('editContentBody');
    const previewContent = document.getElementById('editPreviewContent');
    
    if (textarea && previewContent) {
      const markdown = textarea.value;
      const html = this.parseMarkdown(markdown);
      previewContent.innerHTML = html;
    }
  }

  // 편집 모드 마크다운 보기 모드 전환
  toggleEditMarkdownView(mode) {
    const editor = document.getElementById('editMarkdownEditor');
    const preview = document.getElementById('editMarkdownPreview');
    
    if (!editor || !preview) return;
    
    switch (mode) {
      case 'split':
        editor.style.display = 'flex';
        editor.style.flex = '1';
        preview.style.display = 'flex';
        preview.style.flex = '1';
        break;
      case 'edit':
        editor.style.display = 'flex';
        editor.style.flex = '1';
        preview.style.display = 'none';
        break;
      case 'preview':
        editor.style.display = 'none';
        preview.style.display = 'flex';
        preview.style.flex = '1';
        break;
    }
    
    this.updateEditMarkdownPreview();
  }

  // 편집된 콘텐츠 저장
  saveEditedContent(contentId) {
    const titleInput = document.getElementById('editContentTitle');
    const categorySelect = document.getElementById('editContentCategory');
    const bodyTextarea = document.getElementById('editContentBody');

    if (!titleInput || !categorySelect || !bodyTextarea) {
      this.showAlert('입력 요소를 찾을 수 없습니다.');
      return;
    }

    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const body = bodyTextarea.value.trim();

    if (!title || !body) {
      this.showAlert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 내부 콘텐츠인지 확인
    const contentIndex = this.contents.findIndex(c => c.id === contentId);
    
    if (contentIndex > -1) {
      // 내부 콘텐츠 업데이트
      this.contents[contentIndex].title = title;
      this.contents[contentIndex].category = category;
      this.contents[contentIndex].content = body;
      this.contents[contentIndex].updatedAt = new Date();

      // 썸네일 업데이트
      this.updateThumbnail(this.contents[contentIndex]);

      // 데이터 저장
      this.saveToStorage();
    } else {
      // 예제 콘텐츠를 편집하는 경우 새로운 콘텐츠로 생성
      const newContent = {
        id: this.nextId++,
        title: title,
        category: category,
        content: body,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 배열에 추가
      this.contents.unshift(newContent);

      // 기존 썸네일 제거
      const oldThumbnail = document.querySelector(`[data-content-id="${contentId}"]`);
      if (oldThumbnail) {
        oldThumbnail.remove();
      }

      // 새 썸네일 생성
      this.createThumbnail(newContent);

      // 데이터 저장
      this.saveToStorage();
    }

    this.closeModal();
    this.showAlert('콘텐츠가 수정되었습니다!');
    
    // 카테고리 필터링 새로고침
    if (window.categoryInstance) {
      window.categoryInstance.filterContent(window.categoryInstance.getActiveCategory());
    }
  }

  // 콘텐츠 상세 모달 (마크다운 렌더링)
  showContentModal(content) {
    const renderedContent = this.parseMarkdown(content.content);
    const category = this.getCategoryInfo(content.category);
    
    const modalContent = `
      <div class="modal" style="width: 800px; max-width: 90vw; height: 80vh; display: flex; flex-direction: column;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title" style="font-size: 20px;">
          📄 ${this.escapeHtml(content.title)}
          <span style="background: ${category.color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin-left: 10px;">
            ${category.name.replace(/^[\p{Emoji}]\s*/u, '')}
          </span>
        </div>
        
        <div style="flex: 1; margin: 25px 0; padding: 25px; border: 1px solid #e3e6ea; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); overflow-y: auto;">
          <div style="line-height: 1.7; color: #333;">
            ${renderedContent}
          </div>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 6px; font-size: 12px; color: #6c757d; border-left: 4px solid #007bff;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><strong>📅 생성일:</strong> ${this.formatDateTime(content.createdAt)}</div>
            <div><strong>✏️ 수정일:</strong> ${this.formatDateTime(content.updatedAt)}</div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button onclick="window.contentInstance.editContentById(${content.id})" style="background: #ffc107; color: #212529;">✏️ 편집</button>
          <button onclick="window.contentInstance.deleteContentById(${content.id})" style="background: #dc3545; color: white;">🗑️ 삭제</button>
          <button onclick="window.contentInstance.duplicateContentFromModal(${content.id})" style="background: #6f42c1; color: white;">📋 복사</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">❌ 닫기</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);
  }

  // 썸네일별 컨텍스트 메뉴
  showThumbnailContextMenu(contentId, x, y) {
    // 기존 메뉴 제거
    const existingMenu = document.querySelector('.thumbnail-context-menu');
    if (existingMenu) existingMenu.remove();

    const contextMenu = document.createElement('div');
    contextMenu.className = 'thumbnail-context-menu';
    contextMenu.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      min-width: 150px;
      overflow: hidden;
    `;

    const menuItems = [
      { text: '👁️ 자세히 보기', action: () => this.viewContent(contentId) },
      { text: '✏️ 편집', action: () => this.editContentById(contentId) },
      { text: '🗑️ 삭제', action: () => this.deleteContentById(contentId), color: '#dc3545' },
      { text: '📋 복사', action: () => this.duplicateContent(contentId) },
      { text: '📁 카테고리 변경', action: () => this.showCategoryChangeModal(contentId) }
    ];

    menuItems.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.textContent = item.text;
      menuItem.style.cssText = `
        padding: 10px 15px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
        color: ${item.color || '#333'};
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
      const closeHandler = () => {
        if (contextMenu.parentNode) {
          contextMenu.remove();
        }
        document.removeEventListener('click', closeHandler);
      };
      document.addEventListener('click', closeHandler);
    }, 10);
  }

  // 카테고리 변경 모달
  showCategoryChangeModal(contentId) {
    const content = this.findContentById(contentId);
    if (!content) {
      this.showAlert('콘텐츠를 찾을 수 없습니다.');
      return;
    }

    const categories = window.categoryInstance ? 
      window.categoryInstance.getAllCategories() : 
      [
        { id: 'projects', name: '💻 프로젝트' },
        { id: 'blog', name: '📝 블로그' },
        { id: 'study', name: '📖 스터디' }
      ];

    const categoryOptions = categories
      .filter(cat => cat.id !== 'all')
      .map(cat => `<option value="${cat.id}" ${content.category === cat.id ? 'selected' : ''}>${cat.name}</option>`)
      .join('');

    const modalContent = `
      <div class="modal" style="width: 400px;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">카테고리 변경</div>
        
        <div style="margin-bottom: 15px;">
          <strong>콘텐츠:</strong> ${this.escapeHtml(content.title)}
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">새 카테고리:</label>
          <select id="newCategory" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px;">
            ${categoryOptions}
          </select>
        </div>
        
        <div class="modal-actions">
          <button onclick="window.contentInstance.changeContentCategory(${contentId})" style="background: #28a745; color: white;">✅ 변경</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">❌ 취소</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);
  }

  // 콘텐츠 카테고리 변경
  changeContentCategory(contentId) {
    const newCategorySelect = document.getElementById('newCategory');
    if (!newCategorySelect) return;

    const newCategoryId = newCategorySelect.value;
    
    // 내부 콘텐츠 업데이트
    const contentIndex = this.contents.findIndex(c => c.id === contentId);
    if (contentIndex > -1) {
      this.contents[contentIndex].category = newCategoryId;
      this.contents[contentIndex].updatedAt = new Date();
      this.updateThumbnail(this.contents[contentIndex]);
      this.saveToStorage();
    } else {
      // DOM 콘텐츠 업데이트
      const thumbnail = document.querySelector(`[data-content-id="${contentId}"]`);
      if (thumbnail) {
        thumbnail.dataset.category = newCategoryId;
        this.updateThumbnailCategoryDisplay(thumbnail, { category: newCategoryId });
      }
    }

    this.closeModal();
    this.showAlert('카테고리가 변경되었습니다!');
    
    // 카테고리 필터링 새로고침
    if (window.categoryInstance) {
      window.categoryInstance.filterContent(window.categoryInstance.getActiveCategory());
    }
  }

  // 콘텐츠 보기
  viewContent(contentId) {
    const content = this.findContentById(contentId);
    if (content) {
      this.showContentModal(content);
    }
  }

  // ID로 콘텐츠 편집
  editContentById(contentId) {
    const content = this.findContentById(contentId);
    if (content) {
      this.showEditContentModal(content);
    } else {
      this.showAlert('편집할 콘텐츠를 찾을 수 없습니다.');
    }
  }

  // ID로 콘텐츠 삭제
  deleteContentById(contentId) {
    const content = this.findContentById(contentId);
    if (content) {
      this.deleteContent(contentId);
    } else {
      this.showAlert('삭제할 콘텐츠를 찾을 수 없습니다.');
    }
  }

  // 콘텐츠 복사
  duplicateContent(contentId) {
    const content = this.findContentById(contentId);
    if (content) {
      const duplicatedContent = {
        id: this.nextId++,
        title: `${content.title} (복사본)`,
        category: content.category,
        content: content.content,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 내부 콘텐츠라면 배열에 추가
      if (this.contents.find(c => c.id === contentId)) {
        this.contents.unshift(duplicatedContent);
        this.saveToStorage();
      } else {
        // 예제 콘텐츠라면 새로운 콘텐츠로 추가
        this.contents.unshift(duplicatedContent);
        this.saveToStorage();
      }

      this.createThumbnail(duplicatedContent);
      this.showAlert('콘텐츠가 복사되었습니다!');
      
      // 카테고리 필터링 새로고침
      if (window.categoryInstance) {
        window.categoryInstance.filterContent(window.categoryInstance.getActiveCategory());
      }
    }
  }

  // 복사 함수 (모달에서 호출)
  duplicateContentFromModal(contentId) {
    this.closeModal();
    this.duplicateContent(contentId);
  }

  // ID로 콘텐츠 찾기 (내부 콘텐츠 + 예제 콘텐츠)
  findContentById(contentId) {
    // 먼저 내부 콘텐츠에서 찾기
    let content = this.contents.find(c => c.id === contentId);
    
    // 내부 콘텐츠에 없으면 DOM에서 예제 데이터 추출
    if (!content) {
      const thumbnail = document.querySelector(`[data-content-id="${contentId}"]`);
      if (thumbnail) {
        content = this.extractContentFromThumbnail(thumbnail, contentId);
      }
    }
    
    return content;
  }

  // 썸네일에서 콘텐츠 정보 추출
  extractContentFromThumbnail(thumbnail, contentId) {
    try {
      const titleElement = thumbnail.querySelector('h3');
      const contentElement = thumbnail.querySelector('div[style*="flex: 1"]');
      
      if (!titleElement) {
        return null;
      }

      const title = titleElement.textContent.replace('📄 ', '').trim();
      const contentText = contentElement ? contentElement.textContent.trim() : '';
      
      // 카테고리 추출
      let category = 'projects';
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

  // 콘텐츠 삭제
  deleteContent(contentId) {
    this.showConfirm('이 콘텐츠를 삭제하시겠습니까?', () => {
      // 내부 콘텐츠에서 제거
      const contentIndex = this.contents.findIndex(c => c.id === contentId);
      if (contentIndex > -1) {
        this.contents.splice(contentIndex, 1);
        this.saveToStorage();
      }

      // DOM에서 제거 (예제 콘텐츠도 포함)
      const thumbnail = document.querySelector(`[data-content-id="${contentId}"]`);
      if (thumbnail) {
        thumbnail.remove();
      }

      this.closeModal();
      this.showAlert('콘텐츠가 삭제되었습니다.');
      
      // 카테고리 필터링 새로고침
      if (window.categoryInstance) {
        window.categoryInstance.filterContent(window.categoryInstance.getActiveCategory());
      }
    });
  }

  // 컨텍스트 메뉴 표시
  showContextMenu(x, y) {
    // 기존 메뉴 제거
    const existingMenu = document.querySelector('.content-context-menu');
    if (existingMenu) existingMenu.remove();

    const contextMenu = document.createElement('div');
    contextMenu.className = 'content-context-menu';
    contextMenu.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      min-width: 150px;
      overflow: hidden;
    `;

    const menuItems = [
      { text: '📝 새 내용 추가', action: () => this.showAddContentModal() },
      { text: '🔄 새로고침', action: () => location.reload() },
      { text: '🗑️ 모든 내용 삭제', action: () => this.deleteAllContent(), color: '#dc3545' },
      { text: '📤 내보내기', action: () => this.exportContents() },
      { text: '📥 가져오기', action: () => this.importContents() }
    ];

    menuItems.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.textContent = item.text;
      menuItem.style.cssText = `
        padding: 10px 15px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
        color: ${item.color || '#333'};
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
      const closeHandler = () => {
        if (contextMenu.parentNode) {
          contextMenu.remove();
        }
        document.removeEventListener('click', closeHandler);
      };
      document.addEventListener('click', closeHandler);
    }, 10);
  }

  // 모든 콘텐츠 삭제
  deleteAllContent() {
    this.showConfirm('모든 콘텐츠를 삭제하시겠습니까?', () => {
      this.showConfirm('정말로 모든 콘텐츠를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.', () => {
        // 모든 썸네일 제거
        const allThumbnails = document.querySelectorAll('.content-thumbnail');
        allThumbnails.forEach(thumbnail => thumbnail.remove());

        // 내부 콘텐츠 배열 초기화
        this.contents = [];
        this.nextId = 1;

        // 데이터 저장
        this.saveToStorage();

        this.showAlert('모든 콘텐츠가 삭제되었습니다.');
      });
    });
  }

  // 콘텐츠 내보내기
  exportContents() {
    // 모든 콘텐츠 수집 (내부 + DOM의 예제 콘텐츠)
    const allContents = [...this.contents];
    
    // DOM에서 예제 콘텐츠 추출
    const thumbnails = document.querySelectorAll('.content-thumbnail');
    thumbnails.forEach(thumbnail => {
      const contentId = parseInt(thumbnail.dataset.contentId);
      
      // 이미 내부 콘텐츠에 있는지 확인
      if (!allContents.find(c => c.id === contentId)) {
        const extractedContent = this.extractContentFromThumbnail(thumbnail, contentId);
        if (extractedContent) {
          allContents.push(extractedContent);
        }
      }
    });

    if (allContents.length === 0) {
      this.showAlert('내보낼 콘텐츠가 없습니다.');
      return;
    }

    const dataStr = JSON.stringify(allContents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `portfolio_contents_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    this.showAlert('모든 콘텐츠가 성공적으로 내보내기되었습니다!');
  }

  // 콘텐츠 가져오기
  importContents() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedContents = JSON.parse(e.target.result);
            
            if (!Array.isArray(importedContents)) {
              this.showAlert('올바르지 않은 파일 형식입니다.');
              return;
            }

            this.showConfirm('기존 콘텐츠를 모두 교체하시겠습니까?', () => {
              // 기존 썸네일들 제거
              const existingThumbnails = document.querySelectorAll('.content-thumbnail');
              existingThumbnails.forEach(thumbnail => thumbnail.remove());

              // 새 콘텐츠로 교체
              this.contents = importedContents.map(content => ({
                ...content,
                id: this.nextId++,
                createdAt: new Date(content.createdAt),
                updatedAt: new Date(content.updatedAt)
              }));

              // 썸네일들 다시 생성
              this.contents.forEach(content => this.createThumbnail(content));

              this.saveToStorage();
              this.showAlert('콘텐츠를 성공적으로 가져왔습니다!');
            });
          } catch (error) {
            this.showAlert('파일을 읽는 중 오류가 발생했습니다.');
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  }

  // 유틸리티 함수들
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatDate(date) {
    if (!date) return '날짜 없음';
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR');
  }

  formatDateTime(date) {
    if (!date) return '날짜 없음';
    const d = new Date(date);
    return d.toLocaleString('ko-KR');
  }

  getTimeAgo(date) {
    if (!date) return '시간 불명';
    
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)}주 전`;
    if (diffDays < 365) return `${Math.floor(diffDays/30)}개월 전`;
    return `${Math.floor(diffDays/365)}년 전`;
  }

  // 로컬스토리지에 저장
  saveToStorage() {
    try {
      const contentData = {
        contents: this.contents,
        nextId: this.nextId,
        version: '2.0' // 버전 정보 추가
      };
      localStorage.setItem('portfolio_contents', JSON.stringify(contentData));
    } catch (error) {
      console.error('콘텐츠 저장 실패:', error);
    }
  }

  // 로컬스토리지에서 로드
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('portfolio_contents');
      if (saved) {
        const contentData = JSON.parse(saved);
        
        // 버전 호환성 확인
        if (contentData.version === '2.0') {
          this.contents = contentData.contents.map(content => ({
            ...content,
            createdAt: new Date(content.createdAt),
            updatedAt: new Date(content.updatedAt)
          }));
          this.nextId = contentData.nextId || 1;
        } else {
          // 구 버전 데이터 마이그레이션
          this.migrateOldContentData(contentData);
        }

        // 기존 예제 썸네일들 제거
        const existingThumbnails = document.querySelectorAll('.content-thumbnail');
        existingThumbnails.forEach(thumbnail => thumbnail.remove());

        // 저장된 콘텐츠들의 썸네일 생성
        this.contents.forEach(content => this.createThumbnail(content));
      }
    } catch (error) {
      console.error('콘텐츠 로드 실패:', error);
    }
  }

  // 구 버전 데이터 마이그레이션
  migrateOldContentData(contentData) {
    this.contents = (contentData.contents || []).map(content => ({
      ...content,
      createdAt: new Date(content.createdAt || new Date()),
      updatedAt: new Date(content.updatedAt || new Date())
    }));
    this.nextId = contentData.nextId || 1;
    
    // 새 형식으로 저장
    this.saveToStorage();
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
    
    // 카테고리 시스템과 동기화 요청
    setTimeout(() => {
      if (window.categoryInstance) {
        const categories = window.categoryInstance.getAllCategories();
        const categoryMap = window.categoryInstance.getCategoryMap();
        this.onCategoryUpdated(categories, categoryMap);
      } else {
        // 카테고리 인스턴스가 아직 없으면 이벤트 발생으로 요청
        document.dispatchEvent(new CustomEvent('category:request'));
      }
    }, 100);
  }

  // 정리 작업
  cleanup() {
    this.saveToStorage();
  }
}

// 전역 함수들 (HTML에서 호출되는 함수들)
window.showContentModal = (title, content) => {
  if (window.contentInstance) {
    // 예제 콘텐츠를 위한 임시 객체 생성
    const tempContent = {
      id: 0,
      title: title,
      content: content,
      category: 'projects',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    };
    window.contentInstance.showContentModal(tempContent);
  }
};

// 전역에서 사용할 수 있도록 등록
window.Content = Content;