// banner.js

class Banner {
  constructor() {
    this.slideWrapper = document.querySelector('.slider-wrapper');
    this.slides = document.querySelectorAll('.slide');
    this.dots = document.querySelectorAll('.dot');
    this.bannerText = document.querySelector('.banner-text');

    if (!this.slideWrapper || !this.bannerText || this.slides.length === 0) {
      console.error('배너 슬라이더에 필요한 HTML 요소가 없습니다.');
      return;
    }

    this.totalSlides = this.slides.length;
    this.currentIndex = 0;
    
    this.defaultImageUrls = [
      './images/banner1.jpg',
      './images/banner2.jpg',
    ];
    this.imageUrls = [];
  }

  init() {
    this.loadFromStorage();
    this.setupEventListeners();
    this.startAutoSlide();
    this.updateSlider();
  }

  setupEventListeners() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.currentIndex = index;
        this.updateSlider();
      });
    });
  }

  updateSlider() {
    if (!this.slideWrapper || !this.dots || this.dots.length === 0) {
      console.warn('슬라이더 업데이트에 필요한 요소가 없어 실행을 중단합니다.');
      return; 
    }
    this.slideWrapper.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.dots.forEach(dot => dot.classList.remove('active'));
    if (this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.add('active');
    }
  }

  startAutoSlide() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
      this.updateSlider();
    }, 3000);
  }

  showBannerModal() {
    const slideOptions = Array.from({ length: this.totalSlides }, (_, i) => 
      `<option value="${i}">슬라이드 ${i + 1}</option>`
    ).join('');

    // ★★★ [오류 수정] 생략됐던 모든 HTML 요소를 포함한 완전한 코드입니다. ★★★
    const modalContent = `
      <div class="modal">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">배너 설정</div>
        <hr style="margin: 20px 0;">
        
        <label><b>이미지 변경</b></label>
        <div style="display:flex; gap:10px; align-items:center; margin-top: 8px;">
          <select id="slideSelector" style="flex:1;">${slideOptions}</select>
          <input type="file" id="bannerImgInput" accept="image/*" style="flex:2;">
        </div>

        <hr style="margin: 20px 0;">
        
        <label><b>텍스트 변경</b></label>
        <input type="text" id="bannerTextInput" value="${this.bannerText.textContent.trim()}" style="width: 100%; box-sizing: border-box; margin-top: 8px;">
        
        <div class="modal-actions">
          <button id="saveTextBtn" style="background: #28a745; color: white;">텍스트 저장</button>
          <button id="resetBannerBtn" style="background: #dc3545; color: white;">초기화</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">닫기</button>
        </div>
      </div>
    `;
    showModal(modalContent);

    this.bindModalEvents();
}

bindModalEvents() {
    // 이미지 파일 업로드 이벤트
    document.getElementById('bannerImgInput').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      
      const slideIndex = document.getElementById('slideSelector').value;
      const reader = new FileReader();
      
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        await this.setSlideImage(slideIndex, event.target.result);
        showAlert(`슬라이드 ${parseInt(slideIndex) + 1}의 이미지가 변경되었습니다!`, () => closeModal());
      };
    };

    // ★★★ [오류 수정] 이제 이 버튼들이 HTML에 존재하므로 정상적으로 작동합니다. ★★★
    document.getElementById('saveTextBtn').onclick = this.saveBannerText.bind(this);
    document.getElementById('resetBannerBtn').onclick = this.resetBanner.bind(this);
}

  setSlideImage(index, imageUrl) {
    this.slides[index].style.backgroundImage = `url(${imageUrl})`;
    this.imageUrls[index] = imageUrl;
    this.saveToStorage();
  }

  saveBannerText() {
    const textInput = document.getElementById('bannerTextInput');
    this.bannerText.textContent = textInput.value.trim() || '✨ 나만의 포트폴리오 공간 ✨';
    this.saveToStorage();
    
    // ★★★ [오류 수정] 실행 순서 보장
    showAlert('배너 텍스트가 저장되었습니다!', () => {
        closeModal();
    });
  }
  
  resetBanner() {
    showConfirm('배너의 모든 이미지와 텍스트를 초기화하시겠습니까?', () => {
      this.bannerText.textContent = '✨ 나만의 포트폴리오 공간 ✨';
      this.imageUrls = [...this.defaultImageUrls];
      this.applyImagesToSlides();
      this.saveToStorage();
      
      // ★★★ [오류 수정] 실행 순서 보장
      showAlert('배너가 초기화되었습니다!', () => {
          closeModal();
      });
    });
  }

  saveToStorage() {
    const bannerData = {
      text: this.bannerText.textContent,
      images: this.imageUrls
    };
    localStorage.setItem('banner_settings', JSON.stringify(bannerData));
  }

  loadFromStorage() {
    const savedData = JSON.parse(localStorage.getItem('banner_settings'));
    
    if (savedData) {
      this.bannerText.textContent = savedData.text || '✨ 나만의 포트폴리오 공간 ✨';
      this.imageUrls = savedData.images || [...this.defaultImageUrls];
    } else {
      this.bannerText.textContent = '✨ 나만의 포트폴리오 공간 ✨';
      this.imageUrls = [...this.defaultImageUrls];
    }
    this.applyImagesToSlides();
  }

  applyImagesToSlides() {
    this.slides.forEach((slide, index) => {
      const imageUrl = this.imageUrls[index] || this.defaultImageUrls[index] || '';
      slide.style.backgroundImage = `url('${imageUrl}')`;
    });
  }

  cleanup() {
    this.saveToStorage();
  }
}

// ★★★ [오류 수정] 불필요한 전역 함수들을 모두 제거하고,
// main.js가 Banner 클래스를 직접 사용할 수 있도록 이 한 줄만 남깁니다.
window.Banner = Banner;