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
    
    this.events = {}; // 일정 저장용 객체
    
    this.initElements();
    this.bindEvents();
    this.createMiniCalendar();
  }

  // DOM 요소 초기화
  initElements() {
    this.profileImg = document.getElementById('profileImg');
    this.profileImgDefault = document.getElementById('profileImgDefault');
    this.profileDesc1 = document.getElementById('profileDesc1');
    this.profileDesc2 = document.getElementById('profileDesc2');
    this.profileDesc3 = document.getElementById('profileDesc3');
    this.profileBox = document.getElementById('profileBox');
    this.profileLinkList = document.getElementById('profileLinkList');
    this.sideArea = document.querySelector('.side-area');
  }

  // 이벤트 바인딩
  bindEvents() {
    if (this.profileBox) {
      this.profileBox.addEventListener('click', () => {
        this.openProfileModal();
      });
    }
  }

  // 미니 달력 생성
  createMiniCalendar() {
    const miniCalendar = document.createElement('div');
    miniCalendar.className = 'mini-calendar';
    miniCalendar.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 20px;
      width: 200px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 100;
    `;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // 달력 헤더
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 10px;
      background: #007bff;
      color: white;
      font-weight: bold;
      text-align: center;
      border-radius: 7px 7px 0 0;
      font-size: 14px;
    `;
    header.textContent = `${year}년 ${month + 1}월`;

    // 달력 바디
    const body = document.createElement('div');
    body.style.cssText = `
      padding: 10px;
    `;

    // 요일 헤더
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekHeader = document.createElement('div');
    weekHeader.style.cssText = `
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      margin-bottom: 5px;
    `;
    
    weekDays.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.textContent = day;
      dayEl.style.cssText = `
        text-align: center;
        font-size: 11px;
        color: #666;
        font-weight: bold;
        padding: 2px;
      `;
      weekHeader.appendChild(dayEl);
    });

    // 날짜 그리드
    const daysGrid = document.createElement('div');
    daysGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
    `;

    // 달력 날짜 생성
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = now.getDate();

    // 빈 칸 채우기
    for (let i = 0; i < startDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.style.cssText = `
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
      `;
      daysGrid.appendChild(emptyDay);
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement('div');
      dayEl.textContent = day;
      dayEl.style.cssText = `
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        border-radius: 3px;
        ${day === today ? 'background: #007bff; color: white; font-weight: bold;' : 'hover: background: #f8f9fa;'}
        cursor: pointer;
      `;

      // 일정이 있는 날짜 표시
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (this.events[dateKey] && this.events[dateKey].length > 0) {
        dayEl.style.position = 'relative';
        const dot = document.createElement('div');
        dot.style.cssText = `
          position: absolute;
          top: 2px;
          right: 2px;
          width: 4px;
          height: 4px;
          background: #ff4757;
          border-radius: 50%;
        `;
        dayEl.appendChild(dot);
      }

      daysGrid.appendChild(dayEl);
    }

    body.appendChild(weekHeader);
    body.appendChild(daysGrid);
    miniCalendar.appendChild(header);
    miniCalendar.appendChild(body);

    // 클릭 이벤트
    miniCalendar.addEventListener('click', () => {
      this.openCalendarModal();
    });

    // 기존 미니 달력 제거 후 추가
    const existingCalendar = document.querySelector('.mini-calendar');
    if (existingCalendar) {
      existingCalendar.remove();
    }

    document.body.appendChild(miniCalendar);
  }

  // 프로필 렌더링
  renderProfile() {
    if (this.profileImg && this.profileImgDefault) {
      if (this.profile.img) {
        this.profileImg.src = this.profile.img;
        this.profileImg.style.display = "block";
        this.profileImgDefault.style.display = "none";
      } else {
        this.profileImg.style.display = "none";
        this.profileImgDefault.style.display = "block";
      }
    }
    
    if (this.profileDesc1) this.profileDesc1.textContent = this.profile.desc[0] || "";
    if (this.profileDesc2) this.profileDesc2.textContent = this.profile.desc[1] || "";
    if (this.profileDesc3) this.profileDesc3.textContent = this.profile.desc[2] || "";

    // 프로필 링크 리스트 영역을 숨김 처리
    if (this.profileLinkList) {
      this.profileLinkList.style.display = "none";
    }
  }

  // 달력 모달 열기
  openCalendarModal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const modalContent = `
      <div class="modal" style="width: 800px; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">일정 관리</div>
        
        <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <button id="prevMonth" style="padding: 8px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">&lt;</button>
          <h3 id="currentMonth" style="margin: 0; font-size: 18px;">${year}년 ${month + 1}월</h3>
          <button id="nextMonth" style="padding: 8px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">&gt;</button>
        </div>
        
        <div class="calendar-container">
          <div class="week-header" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; margin-bottom: 5px;">
            <div style="text-align: center; font-weight: bold; padding: 10px; color: #ff4757;">일</div>
            <div style="text-align: center; font-weight: bold; padding: 10px;">월</div>
            <div style="text-align: center; font-weight: bold; padding: 10px;">화</div>
            <div style="text-align: center; font-weight: bold; padding: 10px;">수</div>
            <div style="text-align: center; font-weight: bold; padding: 10px;">목</div>
            <div style="text-align: center; font-weight: bold; padding: 10px;">금</div>
            <div style="text-align: center; font-weight: bold; padding: 10px; color: #007bff;">토</div>
          </div>
          <div id="calendarGrid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; border: 1px solid #ddd;">
          </div>
        </div>
        
        <div class="event-form" style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; display: none;">
          <h4 style="margin-top: 0;">일정 추가</h4>
          <input type="hidden" id="selectedDate">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">일정 제목:</label>
            <input type="text" id="eventTitle" placeholder="일정 제목을 입력하세요" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">시간:</label>
            <input type="time" id="eventTime" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">메모:</label>
            <textarea id="eventMemo" placeholder="메모를 입력하세요" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;"></textarea>
          </div>
          <div style="text-align: right;">
            <button id="saveEvent" style="background: #28a745; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">저장</button>
            <button id="cancelEvent" style="background: #6c757d; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">취소</button>
          </div>
        </div>
      </div>
    `;

    this.showModal(modalContent);
    this.bindCalendarEvents(year, month);
    this.renderCalendar(year, month);
  }

  // 달력 이벤트 바인딩
  bindCalendarEvents(year, month) {
    let currentYear = year;
    let currentMonth = month;

    // 이전/다음 달 버튼
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        const currentMonthEl = document.getElementById('currentMonth');
        if (currentMonthEl) {
          currentMonthEl.textContent = `${currentYear}년 ${currentMonth + 1}월`;
        }
        this.renderCalendar(currentYear, currentMonth);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        const currentMonthEl = document.getElementById('currentMonth');
        if (currentMonthEl) {
          currentMonthEl.textContent = `${currentYear}년 ${currentMonth + 1}월`;
        }
        this.renderCalendar(currentYear, currentMonth);
      });
    }

    // 일정 저장 버튼
    const saveBtn = document.getElementById('saveEvent');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const selectedDate = document.getElementById('selectedDate')?.value;
        const title = document.getElementById('eventTitle')?.value?.trim();
        const time = document.getElementById('eventTime')?.value;
        const memo = document.getElementById('eventMemo')?.value?.trim();

        if (!selectedDate || !title) {
          this.showAlert('날짜와 제목을 입력해주세요.');
          return;
        }

        if (!this.events[selectedDate]) {
          this.events[selectedDate] = [];
        }

        this.events[selectedDate].push({
          title,
          time,
          memo,
          id: Date.now()
        });

        // 폼 초기화
        const titleEl = document.getElementById('eventTitle');
        const timeEl = document.getElementById('eventTime');
        const memoEl = document.getElementById('eventMemo');
        const formEl = document.querySelector('.event-form');
        
        if (titleEl) titleEl.value = '';
        if (timeEl) timeEl.value = '';
        if (memoEl) memoEl.value = '';
        if (formEl) formEl.style.display = 'none';

        // 달력 다시 렌더링
        this.renderCalendar(currentYear, currentMonth);
        this.saveEventsToStorage();
        this.createMiniCalendar(); // 미니 달력도 업데이트
        
        this.showAlert('일정이 저장되었습니다!');
      });
    }

    // 일정 취소 버튼
    const cancelBtn = document.getElementById('cancelEvent');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        const formEl = document.querySelector('.event-form');
        const titleEl = document.getElementById('eventTitle');
        const timeEl = document.getElementById('eventTime');
        const memoEl = document.getElementById('eventMemo');
        
        if (formEl) formEl.style.display = 'none';
        if (titleEl) titleEl.value = '';
        if (timeEl) timeEl.value = '';
        if (memoEl) memoEl.value = '';
      });
    }
  }

  // 달력 렌더링
  renderCalendar(year, month) {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    
    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();

    // 빈 칸 채우기 (이전 달)
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const dayEl = document.createElement('div');
      dayEl.style.cssText = `
        min-height: 100px;
        border: 1px solid #eee;
        padding: 8px;
        background: #f8f9fa;
        color: #ccc;
        position: relative;
        cursor: pointer;
      `;
      dayEl.innerHTML = `<div style="font-weight: bold; margin-bottom: 5px;">${prevLastDay - i}</div>`;
      grid.appendChild(dayEl);
    }

    // 현재 달 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement('div');
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
      
      dayEl.style.cssText = `
        min-height: 100px;
        border: 1px solid #eee;
        padding: 8px;
        background: ${isToday ? '#e3f2fd' : '#fff'};
        position: relative;
        cursor: pointer;
        transition: background 0.2s;
      `;

      dayEl.innerHTML = `<div style="font-weight: bold; margin-bottom: 5px; color: ${isToday ? '#007bff' : '#333'};">${day}</div>`;

      // 일정 표시
      if (this.events[dateKey] && this.events[dateKey].length > 0) {
        const eventsContainer = document.createElement('div');
        this.events[dateKey].forEach(event => {
          const eventEl = document.createElement('div');
          eventEl.style.cssText = `
            background: #007bff;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            margin-bottom: 2px;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          `;
          eventEl.textContent = event.time ? `${event.time} ${event.title}` : event.title;
          eventEl.onclick = (e) => {
            e.stopPropagation();
            this.showEventDetails(event, dateKey);
          };
          eventsContainer.appendChild(eventEl);
        });
        dayEl.appendChild(eventsContainer);
      }

      // 날짜 클릭 이벤트
      dayEl.addEventListener('click', () => {
        const selectedDateEl = document.getElementById('selectedDate');
        const formEl = document.querySelector('.event-form');
        const titleEl = document.getElementById('eventTitle');
        
        if (selectedDateEl) selectedDateEl.value = dateKey;
        if (formEl) formEl.style.display = 'block';
        if (titleEl) titleEl.focus();
      });

      dayEl.addEventListener('mouseenter', () => {
        if (!isToday) dayEl.style.background = '#f8f9fa';
      });

      dayEl.addEventListener('mouseleave', () => {
        if (!isToday) dayEl.style.background = '#fff';
      });

      grid.appendChild(dayEl);
    }

    // 빈 칸 채우기 (다음 달)
    const remainingCells = 42 - (startDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
      const dayEl = document.createElement('div');
      dayEl.style.cssText = `
        min-height: 100px;
        border: 1px solid #eee;
        padding: 8px;
        background: #f8f9fa;
        color: #ccc;
        position: relative;
        cursor: pointer;
      `;
      dayEl.innerHTML = `<div style="font-weight: bold; margin-bottom: 5px;">${day}</div>`;
      grid.appendChild(dayEl);
    }
  }

  // 일정 상세 보기
  showEventDetails(event, dateKey) {
    const detailModal = `
      <div class="modal" style="width: 500px;">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">일정 상세</div>
        
        <div style="margin-bottom: 15px;">
          <strong>날짜:</strong> ${dateKey}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>제목:</strong> ${event.title}
        </div>
        ${event.time ? `<div style="margin-bottom: 15px;"><strong>시간:</strong> ${event.time}</div>` : ''}
        ${event.memo ? `<div style="margin-bottom: 15px;"><strong>메모:</strong><br>${event.memo}</div>` : ''}
        
        <div style="text-align: right; margin-top: 20px;">
          <button onclick="window.sidebarInstance.deleteEvent('${dateKey}', ${event.id})" style="background: #dc3545; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">삭제</button>
          <button onclick="closeModal()" style="background: #6c757d; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">닫기</button>
        </div>
      </div>
    `;
    
    this.showModal(detailModal);
  }

  // 일정 삭제
  deleteEvent(dateKey, eventId) {
    if (this.events[dateKey]) {
      this.events[dateKey] = this.events[dateKey].filter(event => event.id !== eventId);
      if (this.events[dateKey].length === 0) {
        delete this.events[dateKey];
      }
    }
    
    this.saveEventsToStorage();
    this.createMiniCalendar();
    this.closeModal();
    this.openCalendarModal(); // 달력 모달 다시 열기
    this.showAlert('일정이 삭제되었습니다!');
  }

  // 링크 박스 렌더링
  renderLinkBoxes() {
    // 기존 링크 박스들 제거 (동적으로 생성된 것만)
    const existingBoxes = document.querySelectorAll('.link-box.dynamic');
    existingBoxes.forEach(box => box.remove());

    // 새로운 링크 박스들 생성
    const sideArea = document.querySelector('.side-area');
    if (!sideArea) return;
    
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

    this.showModal(modalContent);
    this.bindModalEvents();
  }

  // 모달 이벤트 바인딩
  bindModalEvents() {
    // 프로필 이미지 업로드
    const profileImgInput = document.getElementById('profileImgInput');
    if (profileImgInput) {
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
    }

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
    const saveBtn = document.getElementById('profileModalSaveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        // 프로필 정보 저장
        const desc1 = document.getElementById('profileDescInput1');
        const desc2 = document.getElementById('profileDescInput2');
        const desc3 = document.getElementById('profileDescInput3');
        
        if (desc1) this.profile.desc[0] = desc1.value;
        if (desc2) this.profile.desc[1] = desc2.value;
        if (desc3) this.profile.desc[2] = desc3.value;
        
        // 링크 정보 저장
        for (let i = 1; i <= 3; i++) {
          const titleInput = document.getElementById(`linkTitle${i}`);
          const urlInput = document.getElementById(`linkUrl${i}`);
          
          if (!this.profile.links[i-1]) {
            this.profile.links[i-1] = { url: "", img: null, title: "" };
          }
          
          if (titleInput) this.profile.links[i-1].title = titleInput.value;
          if (urlInput) this.profile.links[i-1].url = urlInput.value;
        }
        
        this.closeModal();
        this.renderProfile();
        this.renderLinkBoxes();
        
        // 데이터 저장 (로컬스토리지)
        this.saveToStorage();
        
        this.showAlert('프로필이 저장되었습니다!');
      });
    }
  }

  // 일정 저장 (로컬스토리지)
  saveEventsToStorage() {
    try {
      localStorage.setItem('sidebar_events', JSON.stringify(this.events));
    } catch (error) {
      console.error('일정 저장 실패:', error);
    }
  }

  // 일정 로드 (로컬스토리지)
  loadEventsFromStorage() {
    try {
      const saved = localStorage.getItem('sidebar_events');
      if (saved) {
        this.events = JSON.parse(saved);
      }
    } catch (error) {
      console.error('일정 로드 실패:', error);
    }
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
    this.loadEventsFromStorage();
    this.renderProfile();
    this.renderLinkBoxes();
    this.createMiniCalendar();
  }

  // 정리 작업
  cleanup() {
    this.saveToStorage();
    this.saveEventsToStorage();
    
    // 미니 달력 제거
    const existingCalendar = document.querySelector('.mini-calendar');
    if (existingCalendar) {
      existingCalendar.remove();
    }
  }
}

// 전역에서 사용할 수 있도록 등록
window.Sidebar = Sidebar;

// 전역 sidebar 인스턴스 (일정 삭제 등에서 사용)
window.sidebarInstance = null;