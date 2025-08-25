// ====== 배너 모듈 ======
class Banner {
  constructor() {
    this.bannerElement = null;
    this.currentBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    this.initElements();
  }

  // DOM 요소 초기화
  initElements() {
    this.bannerElement = document.querySelector('.main-banner');
  }

  // 배너 이미지 설정 모달 열기
  showBannerModal() {
    const modalContent = `
      <div class="modal">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">배너 이미지 설정</div>
        
        <label>배경 이미지 업로드:</label>
        <input type="file" id="bannerImgInput" accept="image/*">
        
        <label>배경 그라디언트 선택:</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 10px 0;">
          <div onclick="setBannerGradient('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')" 
               style="height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s;">
          </div>
          <div onclick="setBannerGradient('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')" 
               style="height: 50px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s;">
          </div>
          <div onclick="setBannerGradient('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')" 
               style="height: 50px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s;">
          </div>
          <div onclick="setBannerGradient('linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)')" 
               style="height: 50px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s;">
          </div>
          <div onclick="setBannerGradient('linear-gradient(135deg, #fa709a 0%, #fee140 100%)')" 
               style="height: 50px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s;">
          </div>
          <div onclick="setBannerGradient('linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)')" 
               style="height: 50px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s;">
          </div>
        </div>
        
        <label>배너 텍스트 변경:</label>
        <input type="text" id="bannerTextInput" placeholder="배너 텍스트를 입력하세요" value="${this.bannerElement.textContent.replace('🖼️', '').trim()}" style="width: 100%; box-sizing: border-box;">
        
        <div class="modal-actions">
          <button onclick="saveBannerText()" style="background: #28a745; color: white;">텍스트 저장</button>
          <button onclick="resetBanner()" style="background: #dc3545; color: white;">초기화</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">닫기</button>
        </div>
      </div>
    `;

    showModal(modalContent);
    this.bindModalEvents();
  }

  // 모달 이벤트 바인딩
  bindModalEvents() {
    // 파일 업로드 이벤트
    const bannerImgInput = document.getElementById('bannerImgInput');
    if (bannerImgInput) {
      bannerImgInput.addEventListener('change', () => {
        const file = bannerImgInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.setBannerImage(e.target.result);
            closeModal();
            showAlert('배너 이미지가 변경되었습니다!');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // 그라디언트 박스에 호버 효과 추가
    const gradientBoxes = document.querySelectorAll('[onclick^="setBannerGradient"]');
    gradientBoxes.forEach(box => {
      box.addEventListener('mouseenter', function() {
        this.style.borderColor = '#007bff';
        this.style.transform = 'scale(1.05)';
      });
      
      box.addEventListener('mouseleave', function() {
        this.style.borderColor = 'transparent';
        this.style.transform = 'scale(1)';
      });
    });
  }

  // 배너 그라디언트 설정
  setBannerGradient(gradient) {
    if (this.bannerElement) {
      this.bannerElement.style.background = gradient;
      this.bannerElement.style.backgroundImage = ''; // 기존 이미지 제거
      this.currentBackground = gradient;
      this.saveToStorage();
    }
  }

  // 배너 이미지 설정
  setBannerImage(imageUrl) {
    if (this.bannerElement) {
      this.bannerElement.style.background = `url(${imageUrl})`;
      this.bannerElement.style.backgroundSize = 'cover';
      this.bannerElement.style.backgroundPosition = 'center';
      this.bannerElement.style.backgroundRepeat = 'no-repeat';
      this.currentBackground = `url(${imageUrl})`;
      this.saveToStorage();
    }
  }

  // 배너 텍스트 저장
  saveBannerText() {
    const textInput = document.getElementById('bannerTextInput');
    if (textInput && this.bannerElement) {
      const newText = textInput.value.trim() || '✨ 나만의 포트폴리오 공간 ✨';
      
      // 기존 버튼을 유지하면서 텍스트만 변경
      const existingButton = this.bannerElement.querySelector('.banner-btn');
      this.bannerElement.innerHTML = newText;
      if (existingButton) {
        this.bannerElement.appendChild(existingButton);
      }
      
      this.saveToStorage();
      closeModal();
      showAlert('배너 텍스트가 저장되었습니다!');
    }
  }

  // 배너 초기화
  resetBanner() {
    if (this.bannerElement) {
      this.bannerElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      this.bannerElement.style.backgroundImage = '';
      
      // 텍스트도 초기화
      const existingButton = this.bannerElement.querySelector('.banner-btn');
      this.bannerElement.innerHTML = '✨ 나만의 포트폴리오 공간 ✨';
      if (existingButton) {
        this.bannerElement.appendChild(existingButton);
      }
      
      this.currentBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      this.saveToStorage();
    }
  }

  // 로컬스토리지에 저장
  saveToStorage() {
    try {
      const bannerData = {
        background: this.currentBackground,
        text: this.bannerElement ? this.bannerElement.textContent.replace('🖼️', '').trim() : '✨ 나만의 포트폴리오 공간 ✨'
      };
      localStorage.setItem('banner_settings', JSON.stringify(bannerData));
    } catch (error) {
      console.error('배너 설정 저장 실패:', error);
    }
  }

  // 로컬스토리지에서 로드
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('banner_settings');
      if (saved) {
        const bannerData = JSON.parse(saved);
        
        if (this.bannerElement) {
          // 배경 적용
          this.bannerElement.style.background = bannerData.background;
          if (bannerData.background.startsWith('url(')) {
            this.bannerElement.style.backgroundSize = 'cover';
            this.bannerElement.style.backgroundPosition = 'center';
            this.bannerElement.style.backgroundRepeat = 'no-repeat';
          }
          
          // 텍스트 적용 (버튼 유지)
          if (bannerData.text) {
            const existingButton = this.bannerElement.querySelector('.banner-btn');
            this.bannerElement.innerHTML = bannerData.text;
            if (existingButton) {
              this.bannerElement.appendChild(existingButton);
            }
          }
          
          this.currentBackground = bannerData.background;
        }
      }
    } catch (error) {
      console.error('배너 설정 로드 실패:', error);
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
window.showBannerModal = () => {
  if (window.bannerInstance) {
    window.bannerInstance.showBannerModal();
  }
};

window.setBannerGradient = (gradient) => {
  if (window.bannerInstance) {
    window.bannerInstance.setBannerGradient(gradient);
    closeModal();
    showAlert('배너 배경이 변경되었습니다!');
  }
};

window.saveBannerText = () => {
  if (window.bannerInstance) {
    window.bannerInstance.saveBannerText();
  }
};

window.resetBanner = () => {
  if (window.bannerInstance) {
    showConfirm('배너를 초기화하시겠습니까?', () => {
      window.bannerInstance.resetBanner();
      closeModal();
      showAlert('배너가 초기화되었습니다!');
    });
  }
};

// 전역에서 사용할 수 있도록 등록
window.Banner = Banner;