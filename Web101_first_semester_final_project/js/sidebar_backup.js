// ====== 사이드바 모듈 ======
class Sidebar {
  constructor() {
    this.profile = {
      img: null,
      desc: ["개발자 포트폴리오", "웹 개발 전문", "JavaScript & React"],
      links: [
        { url: "https://github.com", img: null, title: "GitHub" },
        { url: "https://velog.io", img: null, title: "Velog 블로그" },
        { url: "https://notion.so", img: null, title: "Notion" }
      ]
    };
    
    this.initElements();
    this.bindEvents();
  }

  // DOM 요소 초기화
  initElements() {
    this.profileImg = document.getElementById('profileImg');
    this.profileImgDefault = document.getElementById('profileImgDefault');
    this.profileDesc1 = document.getElementById('profileDesc1');
    this.profileDesc2 = document.getElementById('profileDesc2');
    this.profileDesc3 = document.getElementById('profileDesc3');
    this.profileEditBtn = document.getElementById('profileEditBtn');
    this.profileBox = document.getElementById('profileBox');
    this.profileLinkList = document.getElementById('profileLinkList');
  }

  // 이벤트 바인딩
  bindEvents() {
    this.profileBox.addEventListener('click', () => {
      this.openProfileModal();
    });
  }

  // 프로필 렌더링
  renderProfile() {
    if (this.profile.img) {
      this.profileImg.src = this.profile.img;
      this.profileImg.style.display = "block";
      this.profileImgDefault.style.display = "none";
    } else {
      this.profileImg.style.display = "none";
      this.profileImgDefault.style.display = "block";
    }
    
    this.profileDesc1.textContent = this.profile.desc[0] || "";
    this.profileDesc2.textContent = this.profile.desc[1] || "";
    this.profileDesc3.textContent = this.profile.desc[2] || "";

    // 기존 링크 리스트 영역 렌더링 (표시용)
    this.profileLinkList.innerHTML = "";
    this.profile.links.forEach((linkObj, i) => {
      if (linkObj.url) {
        const a = document.createElement('a');
        a.href = linkObj.url;
        a.target = '_blank';
        a.textContent = linkObj.title || linkObj.url;
        a.className = 'profile-link';
        a.style.cssText = `
          display: block;
          font-size: 13px;
          color: #007bff;
          text-decoration: underline;
          margin-bottom: 4px;
        `;
        this.profileLinkList.appendChild(a);
      }
    });
  }

  // 링크 박스 렌더링
  renderLinkBoxes() {
    // 기존 링크 박스들 제거 (동적으로 생성된 것만)
    const existingBoxes = document.querySelectorAll('.link-box.dynamic');
    existingBoxes.forEach(box => box.remove());

    // 새로운 링크 박스들 생성
    const sideArea = document.querySelector('.side-area');
    
    this.profile.links.forEach((linkObj, i) => {
      if (linkObj.url && i >= 3) { // 기본 3개 링크 이후의 동적 링크들만 생성
        const linkBox = document.createElement('div');
        linkBox.className = 'link-box dynamic';
        linkBox.style.cssText = `
          width: 100%;
          height: 48px;
          background: #fff;
          border: 1px solid #bbb;
          border-radius: 8px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        `;

        // 링크 이미지
        const linkImg = document.createElement('div');
        linkImg.className = 'link-img';
        linkImg.style.cssText = `
          width: 40px;
          height: 40px;
          margin: 4px 8px 4px 4px;
          border-radius: 6px;
          object-fit: cover;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        `;
        
        if (linkObj.img) {
          const img = document.createElement('img');
          img.src = linkObj.img;
          img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 6px;';
          linkImg.appendChild(img);
        } else {
          linkImg.textContent = '🔗';
          linkImg.style.background = '#007bff';
          linkImg.style.color = 'white';
        }

        // 링크 텍스트
        const linkText = document.createElement('div');
        linkText.className = 'link-url';
        linkText.style.cssText = `
          font-size: 13px;
          color: #555;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        `;
        linkText.textContent = linkObj.title || linkObj.url;

        // 클릭 이벤트 추가
        linkBox.addEventListener('click', function() {
          window.open(linkObj.url, '_blank');
        });

        linkBox.appendChild(linkImg);
        linkBox.appendChild(linkText);
        sideArea.appendChild(linkBox);
      }
    });
  }

  // 프로필 모달 열기
  openProfileModal() {
    const modalContent = `
      <div class="modal" style="width: 600px;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">프로필 편집</div>
        
        <label>프로필 이미지:</label>
        <input type="file" id="profileImgInput" accept="image/*">
        
        <label>소개 1줄:</label>
        <input type="text" id="profileDescInput1" placeholder="개발자 포트폴리오" maxlength="30" value="${this.profile.desc[0] || ""}" style="width: 100%; box-sizing: border-box;">
        
        <label>소개 2줄:</label>
        <input type="text" id="profileDescInput2" placeholder="웹 개발 전문" maxlength="30" value="${this.profile.desc[1] || ""}" style="width: 100%; box-sizing: border-box;">
        
        <label>소개 3줄:</label>
        <input type="text" id="profileDescInput3" placeholder="JavaScript & React" maxlength="30" value="${this.profile.desc[2] || ""}" style="width: 100%; box-sizing: border-box;">
        
        <hr>
        
        <div class="link-section">
          <h4>링크 1</h4>
          <input type="text" id="linkTitle1" placeholder="링크 제목" maxlength="50" value="${this.profile.links[0]?.title || ""}" style="width: 100%; box-sizing: border-box;">
          <input type="text" id="linkUrl1" placeholder="링크 주소 (https://...)" maxlength="200" value="${this.profile.links[0]?.url || ""}" style="width: 100%; box-sizing: border-box;">
          <input type="file" id="linkImg1" accept="image/*">
        </div>
        
        <div class="link-section">
          <h4>링크 2</h4>
          <input type="text" id="linkTitle2" placeholder="링크 제목" maxlength="50" value="${this.profile.links[1]?.title || ""}" style="width: 100%; box-sizing: border-box;">
          <input type="text" id="linkUrl2" placeholder="링크 주소 (https://...)" maxlength="200" value="${this.profile.links[1]?.url || ""}" style="width: 100%; box-sizing: border-box;">
          <input type="file" id="linkImg2" accept="image/*">
        </div>
        
        <div class="link-section">
          <h4>링크 3</h4>
          <input type="text" id="linkTitle3" placeholder="링크 제목" maxlength="50" value="${this.profile.links[2]?.title || ""}" style="width: 100%; box-sizing: border-box;">
          <input type="text" id="linkUrl3" placeholder="링크 주소 (https://...)" maxlength="200" value="${this.profile.links[2]?.url || ""}" style="width: 100%; box-sizing: border-box;">
          <input type="file" id="linkImg3" accept="image/*">
        </div>
        
        <div class="modal-actions">
          <button id="profileModalSaveBtn" style="background: #28a745; color: white;">저장</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white;">취소</button>
        </div>
      </div>
    `;

    showModal(modalContent);
    this.bindModalEvents();
  }

  // 모달 이벤트 바인딩
  bindModalEvents() {
    // 프로필 이미지 업로드
    const profileImgInput = document.getElementById('profileImgInput');
    profileImgInput.addEventListener('change', () => {
      const file = profileImgInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profile.img = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // 링크 이미지 업로드 이벤트들
    for (let i = 1; i <= 3; i++) {
      const linkImgInput = document.getElementById(`linkImg${i}`);
      if (linkImgInput) {
        linkImgInput.addEventListener('change', () => {
          const file = linkImgInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (!this.profile.links[i-1]) {
                this.profile.links[i-1] = { url: "", img: null, title: "" };
              }
              this.profile.links[i-1].img = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }

    // 저장 버튼 이벤트
    document.getElementById('profileModalSaveBtn').addEventListener('click', () => {
      // 프로필 정보 저장
      this.profile.desc[0] = document.getElementById('profileDescInput1').value;
      this.profile.desc[1] = document.getElementById('profileDescInput2').value;
      this.profile.desc[2] = document.getElementById('profileDescInput3').value;
      
      // 링크 정보 저장
      for (let i = 1; i <= 3; i++) {
        const titleInput = document.getElementById(`linkTitle${i}`);
        const urlInput = document.getElementById(`linkUrl${i}`);
        
        if (!this.profile.links[i-1]) {
          this.profile.links[i-1] = { url: "", img: null, title: "" };
        }
        
        this.profile.links[i-1].title = titleInput.value;
        this.profile.links[i-1].url = urlInput.value;
      }
      
      closeModal();
      this.renderProfile();
      this.renderLinkBoxes();
      
      // 데이터 저장 (로컬스토리지)
      this.saveToStorage();
      
      showAlert('프로필이 저장되었습니다!');
    });
  }

  // 로컬스토리지에 저장
  saveToStorage() {
    try {
      localStorage.setItem('sidebar_profile', JSON.stringify(this.profile));
    } catch (error) {
      console.error('프로필 저장 실패:', error);
    }
  }

  // 로컬스토리지에서 로드
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('sidebar_profile');
      if (saved) {
        this.profile = { ...this.profile, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('프로필 로드 실패:', error);
    }
  }

  // 초기화
  init() {
    this.loadFromStorage();
    this.renderProfile();
    this.renderLinkBoxes();
  }

  // 정리 작업
  cleanup() {
    this.saveToStorage();
  }
}

// 전역에서 사용할 수 있도록 등록
window.Sidebar = Sidebar;