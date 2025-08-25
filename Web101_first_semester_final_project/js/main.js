// ====== 개선된 메인 애플리케이션 ======
class MainApp {
  constructor() {
    this.modules = {};
    this.isInitialized = false;
    this.eventListeners = new Map(); // 이벤트 리스너 관리
  }

  // 모든 모듈 로드 및 초기화
  async init() {
    try {
      console.log('🚀 애플리케이션 초기화 시작...');
      
      // 각 모듈 초기화
      await this.initModules();
      
      // 모듈 간 통신 설정
      this.setupInterModuleCommunication();
      
      // 전역 이벤트 리스너 설정
      this.setupGlobalEvents();
      
      this.isInitialized = true;
      console.log('✅ 애플리케이션 초기화 완료');
      
      // 초기화 완료 이벤트 발생
      this.dispatchEvent('app:initialized');
      
    } catch (error) {
      console.error('❌ 애플리케이션 초기화 중 오류 발생:', error);
      this.showError('애플리케이션 초기화에 실패했습니다.');
    }
  }

  // 모든 모듈 초기화
  async initModules() {
    const moduleConfigs = [
      {
        name: 'sidebar',
        class: 'Sidebar',
        description: '사이드바 모듈',
        dependencies: []
      },
      {
        name: 'banner',
        class: 'Banner',
        description: '배너 모듈',
        dependencies: []
      },
      {
        name: 'category',
        class: 'Category',
        description: '카테고리 모듈',
        dependencies: []
      },
      {
        name: 'content',
        class: 'Content',
        description: '콘텐츠 모듈',
        dependencies: ['category'] // 카테고리 모듈에 의존
      }
    ];

    // 의존성을 고려한 순서로 초기화
    for (const config of moduleConfigs) {
      try {
        await this.initModule(config);
      } catch (error) {
        console.error(`❌ ${config.description} 초기화 실패:`, error);
      }
    }
  }

  // 개별 모듈 초기화
  async initModule(config) {
    try {
      // 의존성 확인
      for (const dependency of config.dependencies) {
        if (!this.modules[dependency]) {
          throw new Error(`의존성 모듈 ${dependency}가 초기화되지 않음`);
        }
      }

      // 클래스가 전역에 있는지 확인
      if (typeof window[config.class] === 'function') {
        console.log(`🔧 ${config.description} 초기화 중...`);
        
        // 모듈 인스턴스 생성
        this.modules[config.name] = new window[config.class]();
        
        // 전역 인스턴스로도 등록 (다른 모듈에서 접근 가능하도록)
        window[`${config.name}Instance`] = this.modules[config.name];
        
        // 초기화 메서드가 있으면 호출
        if (typeof this.modules[config.name].init === 'function') {
          this.modules[config.name].init();
        }
        
        console.log(`✅ ${config.description} 초기화 완료`);
      } else {
        throw new Error(`${config.class} 클래스를 찾을 수 없습니다.`);
      }
    } catch (error) {
      console.error(`❌ ${config.description} 초기화 오류:`, error);
      throw error;
    }
  }

  // 모듈 간 통신 설정
  setupInterModuleCommunication() {
    console.log('🔗 모듈 간 통신 설정 중...');
    
    // 카테고리 업데이트 이벤트 설정
    if (this.modules.category) {
      // 카테고리 모듈이 초기화된 후 콘텐츠 모듈에 알림
      setTimeout(() => {
        this.modules.category.notifySystemsOfCategoryChange();
      }, 100);
    }

    // 콘텐츠 모듈에서 카테고리 요청 이벤트 처리
    this.addEventListener('category:request', () => {
      if (this.modules.category) {
        this.modules.category.notifySystemsOfCategoryChange();
      }
    });

    console.log('✅ 모듈 간 통신 설정 완료');
  }

  // 전역 이벤트 설정
  setupGlobalEvents() {
    // 페이지 언로드 시 데이터 저장
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // 전역 에러 핸들링
    window.addEventListener('error', (event) => {
      console.error('🚨 전역 에러 발생:', event.error);
      this.showError('예상치 못한 오류가 발생했습니다.');
    });

    // Unhandled Promise Rejection 핸들링
    window.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 처리되지 않은 Promise 에러:', event.reason);
      event.preventDefault();
      this.showError('비동기 작업 중 오류가 발생했습니다.');
    });

    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
      this.handleGlobalKeydown(e);
    });

    // 온라인/오프라인 상태 감지
    window.addEventListener('online', () => {
      console.log('🌐 온라인 상태로 변경됨');
      this.showSuccess('인터넷 연결이 복원되었습니다.');
    });

    window.addEventListener('offline', () => {
      console.log('📴 오프라인 상태로 변경됨');
      this.showError('인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.');
    });
  }

  // 전역 키보드 이벤트 처리
  handleGlobalKeydown(e) {
    // Ctrl+S: 수동 저장
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      this.saveAllData();
      this.showAlert('모든 데이터가 저장되었습니다!');
    }
    
    // Ctrl+Shift+N: 새 콘텐츠 추가
    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
      e.preventDefault();
      if (this.modules.content) {
        this.modules.content.showAddContentModal();
      }
    }

    // Ctrl+Shift+C: 새 카테고리 추가
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      if (this.modules.category) {
        this.modules.category.addNewCategory();
      }
    }

    // ESC: 모든 모달 닫기
    if (e.key === 'Escape') {
      this.closeAllModals();
    }

    // F5 새로고침 시 데이터 저장
    if (e.key === 'F5') {
      this.saveAllData();
    }

    // Ctrl+Shift+D: 디버그 정보 출력
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      this.debug();
    }
  }

  // 모든 모달 닫기
  closeAllModals() {
    // modalUtils를 통해 모달 닫기
    if (window.modalUtils) {
      window.modalUtils.closeModal();
    }
    
    // 컨텍스트 메뉴들 닫기
    const contextMenus = document.querySelectorAll('.context-menu, .category-context-menu, .thumbnail-context-menu, .content-context-menu');
    contextMenus.forEach(menu => menu.remove());
  }

  // 특정 모듈 가져오기
  getModule(name) {
    return this.modules[name] || null;
  }

  // 모든 모듈 가져오기
  getAllModules() {
    return this.modules;
  }

  // 애플리케이션 상태 확인
  isReady() {
    return this.isInitialized;
  }

  // 모든 데이터 저장
  saveAllData() {
    try {
      let savedCount = 0;
      Object.values(this.modules).forEach(module => {
        if (typeof module.saveToStorage === 'function') {
          module.saveToStorage();
          savedCount++;
        }
      });
      console.log(`💾 ${savedCount}개 모듈의 데이터가 저장되었습니다.`);
      return savedCount;
    } catch (error) {
      console.error('❌ 데이터 저장 실패:', error);
      throw error;
    }
  }

  // 모든 데이터 로드
  loadAllData() {
    try {
      let loadedCount = 0;
      Object.values(this.modules).forEach(module => {
        if (typeof module.loadFromStorage === 'function') {
          module.loadFromStorage();
          loadedCount++;
        }
      });
      console.log(`📂 ${loadedCount}개 모듈의 데이터가 로드되었습니다.`);
      return loadedCount;
    } catch (error) {
      console.error('❌ 데이터 로드 실패:', error);
      throw error;
    }
  }

  // 데이터 내보내기 (개선된 버전)
  exportAllData() {
    try {
      const allData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '2.0',
          appVersion: this.getInfo().version,
          modules: Object.keys(this.modules)
        },
        data: {}
      };
      
      // 각 모듈의 데이터 수집
      Object.keys(this.modules).forEach(moduleName => {
        const module = this.modules[moduleName];
        if (typeof module.saveToStorage === 'function') {
          // 임시로 저장하여 데이터 추출
          module.saveToStorage();
          const storageKey = this.getStorageKey(moduleName);
          if (storageKey) {
            const moduleData = localStorage.getItem(storageKey);
            if (moduleData) {
              allData.data[moduleName] = JSON.parse(moduleData);
            }
          }
        }
      });

      // 파일 다운로드
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      this.showAlert('모든 데이터가 성공적으로 내보내기되었습니다!');
      return allData;
    } catch (error) {
      console.error('❌ 데이터 내보내기 실패:', error);
      this.showAlert('데이터 내보내기에 실패했습니다.');
      throw error;
    }
  }

  // 데이터 가져오기 (개선된 버전)
  importAllData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            
            // 데이터 유효성 검사
            if (!this.validateImportData(importedData)) {
              this.showAlert('올바르지 않은 파일 형식입니다.');
              return;
            }
            
            this.showConfirm(
              `데이터를 가져오시겠습니까?\n\n` +
              `내보낸 날짜: ${new Date(importedData.metadata.exportDate).toLocaleString('ko-KR')}\n` +
              `버전: ${importedData.metadata.version}\n` +
              `모듈: ${importedData.metadata.modules.join(', ')}\n\n` +
              `⚠️ 기존 데이터가 모두 덮어쓰여집니다.`,
              () => {
                this.performDataImport(importedData);
              }
            );
          } catch (error) {
            console.error('❌ 가져오기 파일 파싱 실패:', error);
            this.showAlert('파일을 읽는 중 오류가 발생했습니다.');
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  }

  // 가져오기 데이터 유효성 검사
  validateImportData(data) {
    return (
      data &&
      data.metadata &&
      data.data &&
      typeof data.metadata.exportDate === 'string' &&
      Array.isArray(data.metadata.modules)
    );
  }

  // 데이터 가져오기 실행
  performDataImport(importedData) {
    try {
      let importedCount = 0;
      
      // 각 모듈 데이터 복원
      Object.keys(importedData.data).forEach(moduleName => {
        if (moduleName in this.modules) {
          const storageKey = this.getStorageKey(moduleName);
          if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(importedData.data[moduleName]));
            importedCount++;
          }
        }
      });

      console.log(`📥 ${importedCount}개 모듈의 데이터를 가져왔습니다.`);
      
      this.showAlert(
        `데이터를 성공적으로 가져왔습니다!\n${importedCount}개 모듈의 데이터가 복원되었습니다.\n\n페이지를 새로고침합니다.`,
        () => {
          location.reload();
        }
      );
    } catch (error) {
      console.error('❌ 데이터 가져오기 실행 실패:', error);
      this.showAlert('데이터 가져오기에 실패했습니다.');
    }
  }

  // 모듈별 스토리지 키 반환
  getStorageKey(moduleName) {
    const keyMap = {
      'sidebar': 'sidebar_profile',
      'banner': 'banner_settings',
      'category': 'category_settings',
      'content': 'portfolio_contents'
    };
    return keyMap[moduleName];
  }

  // 모든 데이터 삭제 (개선된 버전)
  clearAllData() {
    this.showConfirm('모든 데이터를 삭제하시겠습니까?', () => {
      this.showConfirm(
        '⚠️ 정말로 모든 데이터를 삭제하시겠습니까?\n\n' +
        '이 작업은 되돌릴 수 없으며 다음 데이터가 모두 삭제됩니다:\n' +
        '• 모든 콘텐츠\n' +
        '• 사용자 카테고리\n' +
        '• 프로필 설정\n' +
        '• 배너 설정',
        () => {
          try {
            // 각 모듈의 스토리지 키 개별 삭제
            Object.keys(this.modules).forEach(moduleName => {
              const storageKey = this.getStorageKey(moduleName);
              if (storageKey) {
                localStorage.removeItem(storageKey);
              }
            });
            
            // 추가로 일정 데이터도 삭제
            localStorage.removeItem('sidebar_events');
            
            console.log('🗑️ 모든 데이터가 삭제되었습니다.');
            
            this.showAlert('모든 데이터가 삭제되었습니다.\n페이지를 새로고침합니다.', () => {
              location.reload();
            });
          } catch (error) {
            console.error('❌ 데이터 삭제 실패:', error);
            this.showAlert('데이터 삭제에 실패했습니다.');
          }
        }
      );
    });
  }

  // 애플리케이션 상태 검사
  performHealthCheck() {
    const healthStatus = {
      timestamp: new Date().toISOString(),
      overall: 'healthy',
      modules: {},
      storage: {},
      issues: []
    };

    // 모듈 상태 검사
    Object.keys(this.modules).forEach(moduleName => {
      const module = this.modules[moduleName];
      const status = {
        initialized: !!module,
        hasInit: typeof module?.init === 'function',
        hasCleanup: typeof module?.cleanup === 'function',
        hasStorage: typeof module?.saveToStorage === 'function'
      };
      
      healthStatus.modules[moduleName] = status;
      
      if (!status.initialized) {
        healthStatus.issues.push(`모듈 ${moduleName}이 초기화되지 않음`);
      }
    });

    // 스토리지 상태 검사
    try {
      const testKey = 'health_check_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      healthStatus.storage.available = true;
    } catch (error) {
      healthStatus.storage.available = false;
      healthStatus.issues.push('로컬스토리지를 사용할 수 없음');
    }

    // 전체 상태 판정
    if (healthStatus.issues.length > 0) {
      healthStatus.overall = 'warning';
    }

    console.group('🏥 애플리케이션 상태 검사');
    console.log('전체 상태:', healthStatus.overall);
    console.log('모듈 상태:', healthStatus.modules);
    console.log('스토리지 상태:', healthStatus.storage);
    if (healthStatus.issues.length > 0) {
      console.warn('발견된 문제들:', healthStatus.issues);
    }
    console.groupEnd();

    return healthStatus;
  }

  // 오류 표시
  showError(message) {
    if (typeof showAlert === 'function') {
      showAlert(`❌ ${message}`);
    } else {
      alert(`❌ ${message}`);
    }
  }

  // 성공 메시지 표시
  showSuccess(message) {
    if (typeof showAlert === 'function') {
      showAlert(`✅ ${message}`);
    } else {
      alert(`✅ ${message}`);
    }
  }

  // 일반 알림 표시
  showAlert(message, callback) {
    if (typeof showAlert === 'function') {
      showAlert(message, callback);
    } else {
      alert(message);
      if (callback) callback();
    }
  }

  // 확인 대화상자 표시
  showConfirm(message, onConfirm, onCancel) {
    if (typeof showConfirm === 'function') {
      showConfirm(message, onConfirm, onCancel);
    } else {
      if (confirm(message)) {
        if (onConfirm) onConfirm();
      } else {
        if (onCancel) onCancel();
      }
    }
  }

  // 이벤트 발생
  dispatchEvent(eventName, data = null) {
    const event = new CustomEvent(eventName, { 
      detail: data,
      bubbles: true 
    });
    document.dispatchEvent(event);
  }

  // 이벤트 리스너 등록
  addEventListener(eventName, callback) {
    document.addEventListener(eventName, callback);
    
    // 이벤트 리스너 추적 (디버깅용)
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
  }

  // 애플리케이션 재시작
  async restart() {
    console.log('🔄 애플리케이션 재시작 중...');
    
    try {
      this.cleanup();
      await this.init();
      
      this.showSuccess('애플리케이션이 재시작되었습니다.');
    } catch (error) {
      console.error('❌ 재시작 실패:', error);
      this.showError('애플리케이션 재시작에 실패했습니다.');
    }
  }

  // 정리 작업
  cleanup() {
    console.log('🧹 애플리케이션 정리 작업 시작...');

    // 모든 모듈의 cleanup 메서드 호출
    Object.values(this.modules).forEach(module => {
      if (typeof module.cleanup === 'function') {
        try {
          module.cleanup();
        } catch (error) {
          console.error('모듈 정리 중 오류:', error);
        }
      }
    });

    // 모든 모달 닫기
    this.closeAllModals();

    // 이벤트 리스너 정리
    this.eventListeners.clear();

    // 모듈 레퍼런스 정리
    Object.keys(this.modules).forEach(moduleName => {
      // 전역 레퍼런스 제거
      delete window[`${moduleName}Instance`];
    });
    this.modules = {};
    this.isInitialized = false;

    console.log('✅ 애플리케이션 정리 완료');
  }

  // 애플리케이션 정보
  getInfo() {
    return {
      version: '2.0.0',
      modules: Object.keys(this.modules),
      initialized: this.isInitialized,
      moduleCount: Object.keys(this.modules).length,
      buildDate: '2024-07-04',
      eventListeners: this.eventListeners.size,
      storageUsage: this.getStorageUsage()
    };
  }

  // 스토리지 사용량 조회
  getStorageUsage() {
    try {
      let totalSize = 0;
      const usage = {};
      
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const size = new Blob([localStorage[key]]).size;
          totalSize += size;
          usage[key] = {
            size: size,
            sizeFormatted: this.formatBytes(size)
          };
        }
      }
      
      return {
        total: totalSize,
        totalFormatted: this.formatBytes(totalSize),
        items: usage,
        itemCount: Object.keys(usage).length
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // 바이트를 읽기 쉬운 형태로 변환
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // 디버그 정보 출력
  debug() {
    const info = this.getInfo();
    const healthStatus = this.performHealthCheck();
    
    console.group('🔍 애플리케이션 디버그 정보');
    console.log('📊 기본 정보:', {
      버전: info.version,
      초기화상태: info.initialized,
      모듈수: info.moduleCount,
      빌드날짜: info.buildDate
    });
    
    console.log('📦 로드된 모듈들:', info.modules);
    console.log('🏗️ 모듈 인스턴스들:', this.modules);
    
    console.log('📱 이벤트 리스너:', {
      총개수: info.eventListeners,
      상세: Object.fromEntries(this.eventListeners)
    });
    
    console.log('💾 스토리지 사용량:', info.storageUsage);
    
    console.log('🏥 상태 검사:', healthStatus);
    
    // 성능 정보
    if (performance && performance.memory) {
      console.log('⚡ 성능 정보:', {
        메모리사용량: this.formatBytes(performance.memory.usedJSHeapSize),
        메모리한계: this.formatBytes(performance.memory.jsHeapSizeLimit),
        총할당량: this.formatBytes(performance.memory.totalJSHeapSize)
      });
    }
    
    console.groupEnd();
    
    // 사용 가능한 전역 함수들 출력
    console.group('🛠️ 사용 가능한 개발자 도구');
    console.log('getModule(name): 특정 모듈 가져오기');
    console.log('getAllModules(): 모든 모듈 가져오기');
    console.log('appDebug(): 이 디버그 정보 다시 보기');
    console.log('appRestart(): 애플리케이션 재시작');
    console.log('saveAllData(): 모든 데이터 저장');
    console.log('loadAllData(): 모든 데이터 로드');
    console.log('exportAllData(): 모든 데이터 내보내기');
    console.log('importAllData(): 모든 데이터 가져오기');
    console.log('clearAllData(): 모든 데이터 삭제');
    console.log('appHealthCheck(): 애플리케이션 상태 검사');
    console.groupEnd();
    
    return {
      info,
      healthStatus,
      storageUsage: info.storageUsage
    };
  }

  // 성능 모니터링 시작
  startPerformanceMonitoring() {
    if (!performance || !performance.mark) {
      console.warn('성능 모니터링을 지원하지 않는 브라우저입니다.');
      return;
    }

    const startTime = performance.now();
    
    // 주요 이벤트 마킹
    const originalDispatchEvent = this.dispatchEvent.bind(this);
    this.dispatchEvent = (eventName, data) => {
      performance.mark(`event-${eventName}-start`);
      const result = originalDispatchEvent(eventName, data);
      performance.mark(`event-${eventName}-end`);
      performance.measure(`event-${eventName}`, `event-${eventName}-start`, `event-${eventName}-end`);
      return result;
    };

    console.log('📊 성능 모니터링이 시작되었습니다.');
    return startTime;
  }

  // 성능 리포트 생성
  generatePerformanceReport() {
    if (!performance || !performance.getEntriesByType) {
      console.warn('성능 API를 지원하지 않는 브라우저입니다.');
      return null;
    }

    const marks = performance.getEntriesByType('mark');
    const measures = performance.getEntriesByType('measure');
    
    const report = {
      timestamp: new Date().toISOString(),
      marks: marks.map(mark => ({
        name: mark.name,
        startTime: mark.startTime,
        duration: mark.duration
      })),
      measures: measures.map(measure => ({
        name: measure.name,
        startTime: measure.startTime,
        duration: measure.duration
      })),
      summary: {
        totalMarks: marks.length,
        totalMeasures: measures.length,
        averageDuration: measures.length > 0 ? 
          measures.reduce((sum, m) => sum + m.duration, 0) / measures.length : 0
      }
    };

    console.group('📊 성능 리포트');
    console.log('마크:', report.marks);
    console.log('측정:', report.measures);
    console.log('요약:', report.summary);
    console.groupEnd();

    return report;
  }
}

// ====== 애플리케이션 시작 ======

// DOM이 로드되면 애플리케이션 시작
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🎯 DOM 로드 완료, 애플리케이션 시작');
    
    // 전역 앱 인스턴스 생성
    window.app = new MainApp();
    
    // 성능 모니터링 시작 (개발 모드에서만)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.app.startPerformanceMonitoring();
    }
    
    // 애플리케이션 초기화
    await window.app.init();
    
    // 개발자 도구에서 접근 가능하도록 전역 참조 추가
    window.getModule = (name) => window.app.getModule(name);
    window.getAllModules = () => window.app.getAllModules();
    window.appDebug = () => window.app.debug();
    window.appRestart = () => window.app.restart();
    window.saveAllData = () => window.app.saveAllData();
    window.loadAllData = () => window.app.loadAllData();
    window.exportAllData = () => window.app.exportAllData();
    window.importAllData = () => window.app.importAllData();
    window.clearAllData = () => window.app.clearAllData();
    window.appHealthCheck = () => window.app.performHealthCheck();
    window.appPerformanceReport = () => window.app.generatePerformanceReport();
    
    // 애플리케이션 초기화 완료 이벤트 리스너
    window.app.addEventListener('app:initialized', () => {
      console.log('🎉 애플리케이션이 성공적으로 초기화되었습니다!');
      
      // 개발 모드에서 디버그 정보 표시
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🛠️ 개발 모드에서 실행 중입니다.');
        console.log('🔧 사용 가능한 전역 함수들:');
        console.log('  📦 getModule(name): 특정 모듈 가져오기');
        console.log('  📦 getAllModules(): 모든 모듈 가져오기');
        console.log('  🔍 appDebug(): 애플리케이션 디버그 정보');
        console.log('  🔄 appRestart(): 애플리케이션 재시작');
        console.log('  💾 saveAllData(): 모든 데이터 저장');
        console.log('  📂 loadAllData(): 모든 데이터 로드');
        console.log('  📤 exportAllData(): 모든 데이터 내보내기');
        console.log('  📥 importAllData(): 모든 데이터 가져오기');
        console.log('  🗑️ clearAllData(): 모든 데이터 삭제');
        console.log('  🏥 appHealthCheck(): 애플리케이션 상태 검사');
        console.log('  📊 appPerformanceReport(): 성능 리포트 생성');
        console.log('  ⌨️ 키보드 단축키:');
        console.log('    - Ctrl+S: 수동 저장');
        console.log('    - Ctrl+Shift+N: 새 콘텐츠 추가');
        console.log('    - Ctrl+Shift+C: 새 카테고리 추가');
        console.log('    - Ctrl+Shift+D: 디버그 정보 출력');
        console.log('    - ESC: 모든 모달 닫기');
      }
    });
    
  } catch (error) {
    console.error('❌ 애플리케이션 시작 실패:', error);
    
    // 기본 에러 페이지 표시
    document.body.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        flex-direction: column;
        font-family: Arial, sans-serif;
        background: #f8f9fa;
      ">
        <div style="
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 500px;
        ">
          <h1 style="color: #dc3545; margin-bottom: 20px;">⚠️ 오류 발생</h1>
          <p style="margin-bottom: 20px; color: #666;">
            애플리케이션을 시작하는 중에 오류가 발생했습니다.
          </p>
          <p style="
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            color: #dc3545;
            margin-bottom: 20px;
          ">
            ${error.message}
          </p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="window.location.reload()" style="
              background: #007bff;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            ">
              페이지 새로고침
            </button>
            <button onclick="localStorage.clear(); window.location.reload();" style="
              background: #dc3545;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            ">
              데이터 초기화 후 새로고침
            </button>
          </div>
          <p style="
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          ">
            문제가 지속되면 브라우저의 개발자 도구(F12)에서 자세한 오류 정보를 확인하세요.
          </p>
        </div>
      </div>
    `;
  }
});

// 페이지 로드 완료 메시지
window.addEventListener('load', function() {
  console.log('🎉 포트폴리오 웹 애플리케이션이 완전히 로드되었습니다!');
  console.log('💡 사용법:');
  console.log('  👤 프로필 박스 클릭: 프로필 편집');
  console.log('  📅 미니 달력 클릭: 일정 관리');
  console.log('  🖼️ 배너 우측 하단 버튼: 배너 이미지 설정');
  console.log('  📂 카테고리 탭 클릭: 콘텐츠 필터링');
  console.log('  📂 카테고리 탭 우클릭: 카테고리 편집/삭제');
  console.log('  📝 콘텐츠 영역 더블클릭: 새 내용 추가');
  console.log('  🖱️ 콘텐츠 영역 우클릭: 컨텍스트 메뉴');
  console.log('  📄 썸네일 클릭: 내용 상세보기');
  console.log('  📄 썸네일 우클릭: 편집/삭제/복사/카테고리 변경');
});

// 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MainApp;
} else {
  window.MainApp = MainApp;
}

console.log('🚀 개선된 메인 애플리케이션 스크립트가 로드되었습니다!');