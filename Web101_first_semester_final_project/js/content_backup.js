// ====== 콘텐츠 모듈 ======
class Content {
  constructor() {
    this.contentArea = null;
    this.contents = [];
    this.nextId = 1;
    this.isEditing = false;
    this.initElements();
    this.bindEvents();
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
        if (!e.target.closest('.content-thumbnail')) {
          this.showContextMenu(e.clientX, e.clientY);
        }
      });
    }
  }

  // 새 콘텐츠 추가 모달
  showAddContentModal() {
    const modalContent = `
      <div class="modal" style="width: 700px;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">새 내용 추가</div>
        
        <label>제목:</label>
        <input type="text" id="contentTitle" placeholder="제목을 입력하세요" style="width: 100%; box-sizing: border-box;">
        
        <label>카테고리:</label>
        <select id="contentCategory" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 12px;">
          <option value="projects">💻 프로젝트</option>
          <option value="blog">📝 블로그</option>
          <option value="study">📖 스터디</option>
        </select>
        
        <label>내용:</label>
        <textarea id="contentBody" placeholder="내용을 입력하세요..." style="width: 100%; height: 200px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; resize: vertical; box-sizing: border-box; font-family: inherit; margin-bottom: 12px;"></textarea>
        
        <div class="modal-actions">
          <button onclick="saveNewContent()" style="background: #007bff; color: white;">✅ 저장</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">❌ 취소</button>
        </div>
      </div>
    `;

    showModal(modalContent);
  }

  // 새 콘텐츠 저장
  saveNewContent() {
    const titleInput = document.getElementById('contentTitle');
    const categorySelect = document.getElementById('contentCategory');
    const bodyTextarea = document.getElementById('contentBody');

    if (!titleInput || !categorySelect || !bodyTextarea) {
      showAlert('입력 요소를 찾을 수 없습니다.');
      return;
    }

    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const body = bodyTextarea.value.trim();

    if (!title || !body) {
      showAlert('제목과 내용을 모두 입력해주세요.');
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

    // 썸네일 생성
    this.createThumbnail(newContent);

    // 데이터 저장
    this.saveToStorage();

    closeModal();
    showAlert('새 콘텐츠가 추가되었습니다!');
  }

  // 썸네일 생성
  createThumbnail(content) {
    const categoryColors = {
      'projects': '#007bff',
      'blog': '#dc3545',
      'study': '#ffc107'
    };

    const categoryNames = {
      'projects': '프로젝트',
      'blog': '블로그',
      'study': '스터디'
    };

    const thumbnail = document.createElement('div');
    thumbnail.className = 'content-thumbnail';
    thumbnail.dataset.contentId = content.id;
    thumbnail.onclick = () => this.showContentModal(content);

    const timeAgo = this.getTimeAgo(content.updatedAt);
    const preview = content.content.substring(0, 150);

    thumbnail.innerHTML = `
      <div style="position: absolute; top: 15px; right: 15px; background: ${categoryColors[content.category]}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
        ${categoryNames[content.category]}
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

  // 콘텐츠 상세 모달
  showContentModal(content) {
    const modalContent = `
      <div class="modal" style="width: 800px;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title" style="font-size: 20px;">📄 ${this.escapeHtml(content.title)}</div>
        
        <div style="margin: 25px 0; padding: 25px; border: 1px solid #e3e6ea; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="line-height: 1.7; color: #333; white-space: pre-wrap;">
            ${this.escapeHtml(content.content)}
          </div>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 6px; font-size: 12px; color: #6c757d; border-left: 4px solid #007bff;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><strong>📅 생성일:</strong> ${this.formatDateTime(content.createdAt)}</div>
            <div><strong>✏️ 수정일:</strong> ${this.formatDateTime(content.updatedAt)}</div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button onclick="editContent(${content.id})" style="background: #ffc107; color: #212529;">✏️ 편집</button>
          <button onclick="deleteContent(${content.id})" style="background: #dc3545; color: white;">🗑️ 삭제</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">❌ 닫기</button>
        </div>
      </div>
    `;

    showModal(modalContent);
  }

  // 콘텐츠 편집 모달
  showEditContentModal(content) {
    const modalContent = `
      <div class="modal" style="width: 700px;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">내용 편집</div>
        
        <label>제목:</label>
        <input type="text" id="editContentTitle" value="${this.escapeHtml(content.title)}" style="width: 100%; box-sizing: border-box;">
        
        <label>카테고리:</label>
        <select id="editContentCategory" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 12px;">
          <option value="projects" ${content.category === 'projects' ? 'selected' : ''}>💻 프로젝트</option>
          <option value="blog" ${content.category === 'blog' ? 'selected' : ''}>📝 블로그</option>
          <option value="study" ${content.category === 'study' ? 'selected' : ''}>📖 스터디</option>
        </select>
        
        <label>내용:</label>
        <textarea id="editContentBody" style="width: 100%; height: 200px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; resize: vertical; box-sizing: border-box; font-family: inherit; margin-bottom: 12px;">${this.escapeHtml(content.content)}</textarea>
        
        <div class="modal-actions">
          <button onclick="saveEditedContent(${content.id})" style="background: #28a745; color: white;">💾 저장</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">❌ 취소</button>
        </div>
      </div>
    `;

    showModal(modalContent);
  }

  // 편집된 콘텐츠 저장
  saveEditedContent(contentId) {
    const titleInput = document.getElementById('editContentTitle');
    const categorySelect = document.getElementById('editContentCategory');
    const bodyTextarea = document.getElementById('editContentBody');

    if (!titleInput || !categorySelect || !bodyTextarea) {
      showAlert('입력 요소를 찾을 수 없습니다.');
      return;
    }

    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const body = bodyTextarea.value.trim();

    if (!title || !body) {
      showAlert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 콘텐츠 찾기 및 업데이트
    const contentIndex = this.contents.findIndex(c => c.id === contentId);
    if (contentIndex > -1) {
      this.contents[contentIndex].title = title;
      this.contents[contentIndex].category = category;
      this.contents[contentIndex].content = body;
      this.contents[contentIndex].updatedAt = new Date();

      // 썸네일 업데이트
      this.updateThumbnail(this.contents[contentIndex]);

      // 데이터 저장
      this.saveToStorage();

      closeModal();
      showAlert('콘텐츠가 수정되었습니다!');
    }
  }

  // 썸네일 업데이트
  updateThumbnail(content) {
    const thumbnail = document.querySelector(`[data-content-id="${content.id}"]`);
    if (thumbnail) {
      thumbnail.remove();
      this.createThumbnail(content);
    }
  }

  // 콘텐츠 삭제
  deleteContent(contentId) {
    showConfirm('이 콘텐츠를 삭제하시겠습니까?', () => {
      // 배열에서 제거
      this.contents = this.contents.filter(c => c.id !== contentId);

      // DOM에서 제거
      const thumbnail = document.querySelector(`[data-content-id="${contentId}"]`);
      if (thumbnail) {
        thumbnail.remove();
      }

      // 데이터 저장
      this.saveToStorage();

      closeModal();
      showAlert('콘텐츠가 삭제되었습니다.');
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

  // 콘텐츠 내보내기
  exportContents() {
    if (this.contents.length === 0) {
      showAlert('내보낼 콘텐츠가 없습니다.');
      return;
    }

    const dataStr = JSON.stringify(this.contents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `portfolio_contents_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    showAlert('콘텐츠가 성공적으로 내보내기되었습니다!');
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
              showAlert('올바르지 않은 파일 형식입니다.');
              return;
            }

            showConfirm('기존 콘텐츠를 모두 교체하시겠습니까?', () => {
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
              showAlert('콘텐츠를 성공적으로 가져왔습니다!');
            });
          } catch (error) {
            showAlert('파일을 읽는 중 오류가 발생했습니다.');
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
        nextId: this.nextId
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
        this.contents = contentData.contents.map(content => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt)
        }));
        this.nextId = contentData.nextId || 1;

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

  // 초기화
  init() {
    this.loadFromStorage();
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

window.saveNewContent = () => {
  if (window.contentInstance) {
    window.contentInstance.saveNewContent();
  }
};

window.editContent = (contentId) => {
  if (window.contentInstance) {
    const content = window.contentInstance.contents.find(c => c.id === contentId);
    if (content) {
      closeModal();
      window.contentInstance.showEditContentModal(content);
    } else {
      showAlert('편집 기능은 사용자가 추가한 콘텐츠에서만 사용할 수 있습니다.');
    }
  }
};

window.deleteContent = (contentId) => {
  if (window.contentInstance) {
    const content = window.contentInstance.contents.find(c => c.id === contentId);
    if (content) {
      window.contentInstance.deleteContent(contentId);
    } else {
      showAlert('삭제 기능은 사용자가 추가한 콘텐츠에서만 사용할 수 있습니다.');
    }
  }
};

window.saveEditedContent = (contentId) => {
  if (window.contentInstance) {
    window.contentInstance.saveEditedContent(contentId);
  }
};

// 전역에서 사용할 수 있도록 등록
window.Content = Content;