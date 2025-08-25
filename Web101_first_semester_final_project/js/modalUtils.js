// ====== 모달 유틸리티 모듈 ======
class ModalUtils {
  constructor() {
    this.currentModal = null;
  }

  // 모달 표시
  showModal(content) {
    // 기존 모달 제거
    this.closeModal();

    const backdrop = document.createElement('div');
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = content;
    document.body.appendChild(backdrop);

    this.currentModal = backdrop;

    // 바깥 클릭 시 닫기
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        this.closeModal();
      }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', this.handleEscKey.bind(this));

    return backdrop;
  }

  // 모달 닫기
  closeModal() {
    if (this.currentModal) {
      this.currentModal.remove();
      this.currentModal = null;
    }
    
    // ESC 키 이벤트 리스너 제거
    document.removeEventListener('keydown', this.handleEscKey.bind(this));
  }

  // ESC 키 핸들러
  handleEscKey(e) {
    if (e.key === 'Escape' && this.currentModal) {
      this.closeModal();
    }
  }

  // 확인 다이얼로그
  showConfirm(message, onConfirm, onCancel = null) {
    const modalContent = `
      <div class="modal">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">확인</div>
        <div style="margin: 20px 0; font-size: 16px;">
          ${message}
        </div>
        <div class="modal-actions">
          <button id="confirmBtn" style="background: #007bff; color: white;">확인</button>
          <button id="cancelBtn" style="background: #6c757d; color: white;">취소</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);

    // 확인 버튼 이벤트
    document.getElementById('confirmBtn').addEventListener('click', () => {
      this.closeModal();
      if (onConfirm) onConfirm();
    });

    // 취소 버튼 이벤트
    document.getElementById('cancelBtn').addEventListener('click', () => {
      this.closeModal();
      if (onCancel) onCancel();
    });
  }

  // 알림 다이얼로그
  showAlert(message, onClose = null) {
    const modalContent = `
      <div class="modal">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">알림</div>
        <div style="margin: 20px 0; font-size: 16px;">
          ${message}
        </div>
        <div class="modal-actions">
          <button id="alertOkBtn" style="background: #007bff; color: white;">확인</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);

    // 확인 버튼 이벤트
    document.getElementById('alertOkBtn').addEventListener('click', () => {
      this.closeModal();
      if (onClose) onClose();
    });
  }

  // 입력 다이얼로그
  showPrompt(message, defaultValue = '', onConfirm = null, onCancel = null) {
    const modalContent = `
      <div class="modal">
        <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        <div class="modal-title">입력</div>
        <div style="margin: 20px 0; font-size: 16px;">
          ${message}
        </div>
        <input type="text" id="promptInput" value="${defaultValue}" style="width: 100%; box-sizing: border-box;">
        <div class="modal-actions">
          <button id="promptConfirmBtn" style="background: #007bff; color: white;">확인</button>
          <button id="promptCancelBtn" style="background: #6c757d; color: white;">취소</button>
        </div>
      </div>
    `;

    this.showModal(modalContent);

    const input = document.getElementById('promptInput');
    input.focus();
    input.select();

    // Enter 키로 확인
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('promptConfirmBtn').click();
      }
    });

    // 확인 버튼 이벤트
    document.getElementById('promptConfirmBtn').addEventListener('click', () => {
      const value = input.value;
      this.closeModal();
      if (onConfirm) onConfirm(value);
    });

    // 취소 버튼 이벤트
    document.getElementById('promptCancelBtn').addEventListener('click', () => {
      this.closeModal();
      if (onCancel) onCancel();
    });
  }

  // 로딩 모달
  showLoading(message = '처리 중...') {
    const modalContent = `
      <div class="modal" style="text-align: center;">
        <div style="margin: 20px 0;">
          <div style="
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <div style="font-size: 16px;">
            ${message}
          </div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    return this.showModal(modalContent);
  }

  // 현재 모달이 열려있는지 확인
  isModalOpen() {
    return this.currentModal !== null;
  }
}

// 전역 인스턴스 생성
const modalUtils = new ModalUtils();

// 전역 함수로 등록 (기존 코드와의 호환성을 위해)
window.showModal = (content) => modalUtils.showModal(content);
window.closeModal = () => modalUtils.closeModal();
window.showAlert = (message, onClose) => modalUtils.showAlert(message, onClose);
window.showConfirm = (message, onConfirm, onCancel) => modalUtils.showConfirm(message, onConfirm, onCancel);
window.showPrompt = (message, defaultValue, onConfirm, onCancel) => modalUtils.showPrompt(message, defaultValue, onConfirm, onCancel);

// 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModalUtils;
} else {
  window.ModalUtils = ModalUtils;
  window.modalUtils = modalUtils;
}