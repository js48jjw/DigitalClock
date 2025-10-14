// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadBackgroundImage(); // 배경 이미지 로드
    startClock(); // 7세그먼트 시계 시작
    initializeAlarms(); // 알람 기능 초기화
    
    // 새로고침 버튼 이벤트 리스너 (삭제됨)
    
    // navbar 클릭 이벤트 리스너
    document.getElementById('home-link').addEventListener('click', function(e) {
        e.preventDefault();
        showHome();
    });
    
    document.getElementById('info-link').addEventListener('click', function(e) {
        e.preventDefault();
        showInfo();
    });
    
    // 테마 전환 버튼 이벤트 리스너
    document.getElementById('theme-toggle').addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });
    
    // 정보 화면에서 홈으로 돌아가기 버튼 이벤트 리스너
    document.getElementById('back-to-home').addEventListener('click', function() {
        showHome();
    });
    
    // 복사 버튼 이벤트 리스너 추가 (삭제됨)
    
    // 저장된 테마 설정 적용
    applySavedTheme();
});

// 홈 화면 표시 함수
function showHome() {
    document.getElementById('home-container').style.display = 'block';
    document.getElementById('info-container').style.display = 'none';
}

// 정보 화면 표시 함수
function showInfo() {
    document.getElementById('home-container').style.display = 'none';
    document.getElementById('info-container').style.display = 'block';
}

// 테마 전환 함수
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (body.classList.contains('dark-theme')) {
        // Switch from dark theme to light theme
        body.classList.remove('dark-theme');
        themeToggle.textContent = 'Light Theme';
        // Save theme setting to local storage
        localStorage.setItem('theme', 'light');
    } else {
        // Switch from light theme to dark theme
        body.classList.add('dark-theme');
        themeToggle.textContent = 'Dark Theme';
        // Save theme setting to local storage
        localStorage.setItem('theme', 'dark');
    }
}

// 저장된 테마 설정 적용 함수
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = 'Dark Theme';
    } else {
        themeToggle.textContent = 'Light Theme';
    }
}

// IP 주소 관련 함수들 삭제됨

// 배경 이미지 가져오기 (어두운 사진으로)
function loadBackgroundImage() {
    const body = document.body;
    
    // 로컬 스토리지에서 마지막 업데이트 시간 확인
    const lastUpdate = localStorage.getItem('backgroundLastUpdate');
    const cachedImage = localStorage.getItem('backgroundImage');
    const now = new Date();
    
    // 오늘 이미지를 이미 가져왔는지 확인 (매일 오전 6시 기준)
    if (lastUpdate) {
        const lastUpdateDate = new Date(lastUpdate);
        
        // 마지막 업데이트 날짜의 오전 6시 생성
        const lastUpdateMorning = new Date(lastUpdateDate);
        lastUpdateMorning.setHours(6, 0, 0, 0);
        
        // 현재 시간의 오전 6시 생성
        const todayMorning = new Date(now);
        todayMorning.setHours(6, 0, 0, 0);
        
        // 마지막 업데이트가 오늘 오전 6시 이후이고, 현재 시간이 오늘 오전 6시 이후인 경우
        if (lastUpdateDate >= todayMorning) {
            // 캐시된 이미지가 있으면 사용
            if (cachedImage) {
                body.style.setProperty('--background-image', `url(${cachedImage})`);
                return;
            }
        }
    }
    
    // Picsum Photos를 사용하여 어두운 랜덤 이미지 가져오기
    // filter 파라미터를 사용하여 어두운 이미지 요청
    const imageUrl = `https://picsum.photos/1600/900?random=${Date.now()}&grayscale&blur=2`;
    
    // 이미지 프리로드
    const img = new Image();
    img.onload = function() {
        body.style.setProperty('--background-image', `url(${imageUrl})`);
        // 로컬 스토리지에 저장
        localStorage.setItem('backgroundImage', imageUrl);
        localStorage.setItem('backgroundLastUpdate', now.toISOString());
    };
    
    // 이미지 로딩 실패 시 대체 이미지 설정
    img.onerror = function() {
        console.error('배경 이미지 로딩 실패, 대체 이미지로 변경');
        // 대체 이미지로 그라데이션만 사용
        body.style.setProperty('--background-image', 'none');
    };
    
    img.src = imageUrl;
}

// 위치 정보 가져오기 함수 삭제됨

// 7세그먼트 시계 시작 함수
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

// 시계 업데이트 함수
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // 각 자리 숫자 표시
    displayDigit('hour-tens', hours[0]);
    displayDigit('hour-ones', hours[1]);
    displayDigit('minute-tens', minutes[0]);
    displayDigit('minute-ones', minutes[1]);
    displayDigit('second-tens', seconds[0]);
    displayDigit('second-ones', seconds[1]);

    // 날짜 표시 (형식: 2025 / 10 / 14 , Tue)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });

    const dateString = `${year} / ${month} / ${day} , ${weekday}`;
    document.getElementById('current-date').textContent = dateString;
}

// 알람 기능 초기화
function initializeAlarms() {
    const alarmSetBtn = document.getElementById('alarm-set-btn');
    const alarmModal = document.getElementById('alarm-modal');
    const alarmSaveBtn = document.getElementById('alarm-save-btn');
    const alarmCancelBtn = document.getElementById('alarm-cancel-btn');
    const alarmTimeInput = document.getElementById('alarm-time-input');

    // 모달 현재 시간 표시용 변수
    let modalTimeInterval = null;

    // 알람 설정 버튼 클릭
    alarmSetBtn.addEventListener('click', function() {
        // 마지막 입력값 불러오기 (초 단위 포함)
        const lastDate = localStorage.getItem('lastAlarmDate');
        const lastTime = localStorage.getItem('lastAlarmTime');

        if (lastDate) {
            document.getElementById('alarm-date-input').value = lastDate;
        }
        if (lastTime) {
            alarmTimeInput.value = lastTime;
        }

        alarmModal.style.display = 'flex';
        alarmTimeInput.focus();

        // 모달이 열릴 때 현재 시간 표시 시작
        startModalTimeDisplay();

        // 시간 입력 시 드롭박스 자동 닫힘 이벤트 추가 (한 번만 등록)
        const handleTimeChange = function() {
            // 포커스를 다른 곳으로 이동시켜 드롭박스 닫힘
            setTimeout(() => {
                alarmTimeInput.blur();
            }, 100);
        };

        // 기존 이벤트 리스너 제거 후 새로 추가
        alarmTimeInput.removeEventListener('change', handleTimeChange);
        alarmTimeInput.addEventListener('change', handleTimeChange);
    });

    // 알람 저장 버튼 클릭
    alarmSaveBtn.addEventListener('click', function() {
        const alarmDate = document.getElementById('alarm-date-input').value;
        const alarmTime = alarmTimeInput.value;
        if (alarmDate && alarmTime) {
            const modifyId = alarmModal.getAttribute('data-modify-id');

            if (modifyId) {
                // 수정 모드: 기존 알람 수정
                updateAlarm(parseInt(modifyId), alarmDate, alarmTime);
                alarmModal.removeAttribute('data-modify-id');
            } else {
                // 새 알람 추가
                addAlarm(alarmDate, alarmTime);
            }

            // 입력값 저장 (초 단위 포함)
            localStorage.setItem('lastAlarmDate', alarmDate);
            localStorage.setItem('lastAlarmTime', alarmTime);

            alarmModal.style.display = 'none';
            document.getElementById('alarm-date-input').value = '';
            alarmTimeInput.value = '';
            // 모달 시간 표시 중지
            stopModalTimeDisplay();
        }
    });

    // 알람 취소 버튼 클릭
    alarmCancelBtn.addEventListener('click', function() {
        alarmModal.style.display = 'none';
        // 취소 시 입력값 초기화 및 수정 모드 해제
        document.getElementById('alarm-date-input').value = '';
        alarmTimeInput.value = '';
        alarmModal.removeAttribute('data-modify-id');
        // 모달 시간 표시 중지
        stopModalTimeDisplay();
    });

    // 모달 외부 클릭 시 닫기
    alarmModal.addEventListener('click', function(e) {
        if (e.target === alarmModal) {
            alarmModal.style.display = 'none';
            // 외부 클릭 시 입력값 초기화 및 수정 모드 해제
            document.getElementById('alarm-date-input').value = '';
            alarmTimeInput.value = '';
            alarmModal.removeAttribute('data-modify-id');
            // 모달 시간 표시 중지
            stopModalTimeDisplay();
        }
    });

    // 저장된 알람 로드
    loadSavedAlarms();
}

// 알람 추가 함수
function addAlarm(date, time) {
    const alarmId = Date.now();
    const alarm = {
        id: alarmId,
        date: date,
        time: time,
        datetime: `${date}T${time}`,
        active: true
    };

    // 로컬 스토리지에 저장
    const alarms = getSavedAlarms();
    alarms.push(alarm);
    localStorage.setItem('alarms', JSON.stringify(alarms));

    // UI에 알람 표시
    displayAlarm(alarm);

    // 알람 스케줄링
    scheduleAlarm(alarm);
}

// 알람 수정 함수
function updateAlarm(alarmId, date, time) {
    const alarms = getSavedAlarms();
    const alarmIndex = alarms.findIndex(a => a.id === alarmId);

    if (alarmIndex !== -1) {
        // 기존 알람 정보 업데이트
        alarms[alarmIndex].date = date;
        alarms[alarmIndex].time = time;
        alarms[alarmIndex].datetime = `${date}T${time}`;

        // 로컬 스토리지에 저장
        localStorage.setItem('alarms', JSON.stringify(alarms));

        // UI 업데이트: 기존 항목 제거 후 새로 추가
        const oldAlarmItem = document.querySelector(`[data-id="${alarmId}"]`);
        if (oldAlarmItem) {
            oldAlarmItem.remove();
        }

        // 수정된 알람으로 새 항목 표시
        displayAlarm(alarms[alarmIndex]);

        // 알람 재스케줄링 (기존 타이머 취소 후 새로 설정)
        // 기존 스케줄링은 자동으로 취소되고 새로 스케줄링됨
        scheduleAlarm(alarms[alarmIndex]);
    }
}

// 알람 표시 함수
function displayAlarm(alarm) {
    const alarmList = document.getElementById('alarm-list');
    const alarmItem = document.createElement('div');
    alarmItem.className = 'alarm-item';
    alarmItem.setAttribute('data-id', alarm.id);

    // 날짜와 시간을 보기 좋게 포맷팅 (초 단위 포함)
    const dateObj = new Date(alarm.datetime);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12; // 12시간 형식으로 변환
    const formattedTime = `${displayHours}:${minutes}:${seconds} ${ampm}`;

    alarmItem.innerHTML = `
        <div class="alarm-item-info">
            <span class="alarm-item-date">${formattedDate}</span>
            <span class="alarm-item-time">${formattedTime}</span>
        </div>
        <div class="alarm-item-buttons">
            <button onclick="modifyAlarm(${alarm.id})">Modify</button>
            <button onclick="deleteAlarm(${alarm.id})">Delete</button>
        </div>
    `;

    alarmList.appendChild(alarmItem);
}

// 알람 수정 함수
function modifyAlarm(alarmId) {
    const alarms = getSavedAlarms();
    const alarm = alarms.find(a => a.id === alarmId);

    if (alarm) {
        // 모달 열기 및 기존 값 설정
        const modal = document.getElementById('alarm-modal');
        const dateInput = document.getElementById('alarm-date-input');
        const timeInput = document.getElementById('alarm-time-input');

        // 기존 알람 값 설정
        const alarmDate = new Date(alarm.datetime);
        const dateString = alarmDate.toISOString().split('T')[0];
        const hours = alarmDate.getHours().toString().padStart(2, '0');
        const minutes = alarmDate.getMinutes().toString().padStart(2, '0');
        const seconds = alarmDate.getSeconds().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        dateInput.value = dateString;
        timeInput.value = timeString;

        modal.style.display = 'flex';
        timeInput.focus();

        // 수정 모드임을 표시하기 위해 데이터 속성 추가
        modal.setAttribute('data-modify-id', alarmId);

        // 현재 시간 표시 시작
        startModalTimeDisplay();

        // 시간 입력 시 드롭박스 자동 닫힘 이벤트 추가
        const handleTimeChange = function() {
            setTimeout(() => {
                timeInput.blur();
            }, 100);
        };

        timeInput.removeEventListener('change', handleTimeChange);
        timeInput.addEventListener('change', handleTimeChange);
    }
}

// 알람 삭제 함수
function deleteAlarm(alarmId) {
    // 로컬 스토리지에서 삭제
    const alarms = getSavedAlarms().filter(alarm => alarm.id !== alarmId);
    localStorage.setItem('alarms', JSON.stringify(alarms));

    // UI에서 삭제
    const alarmItem = document.querySelector(`[data-id="${alarmId}"]`);
    if (alarmItem) {
        alarmItem.remove();
    }
}

// 알람 스케줄링 함수
function scheduleAlarm(alarm) {
    const now = new Date();
    const alarmDate = new Date(alarm.datetime);

    // 이미 지난 시간이면 알람을 트리거하지 않음 (일회성 알람)
    if (alarmDate <= now) {
        return;
    }

    const timeUntilAlarm = alarmDate - now;

    // 정확한 시간에 알람이 울리도록 setTimeout 대신 setInterval 사용
    const alarmTimer = setTimeout(() => {
        triggerAlarm(alarm);
        // 타이머 클리어 (한 번만 실행)
        clearTimeout(alarmTimer);
    }, timeUntilAlarm);
}

// 알람 트리거 함수
function triggerAlarm(alarm) {
    // 현재 시간과 알람 설정 시간을 비교하여 정확한 시간에만 울리도록 함
    const now = new Date();
    const alarmDate = new Date(alarm.datetime);

    // 시간 차이가 2초 이내인 경우에만 알람 울림 (부정확성 허용)
    const timeDiff = Math.abs(now - alarmDate);
    if (timeDiff > 2000) { // 2초 이상 차이가 나면 무시
        console.log(`알람 시간 불일치: 설정=${alarmDate.toISOString()}, 현재=${now.toISOString()}, 차이=${timeDiff}ms`);
        return;
    }

    // 알람 알림 표시
    showAlarmNotification(alarm);

    // 브라우저 알림 (권한이 있는 경우)
    if (Notification.permission === 'granted') {
        const dateObj = new Date(alarm.datetime);
        const timeString = dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        new Notification('Alarm', {
            body: `It's ${timeString}!`,
            icon: '/favicon.ico'
        });
    }

    // 소리 재생 (무한 반복)
    playAlarmSoundLoop();

    // 트리거된 알람은 목록에서 유지 (삭제하지 않음)
    // deleteAlarm(alarm.id); // 이 줄을 주석 처리하여 알람이 목록에 남아있도록 함
}

// 알람 알림 표시 함수
function showAlarmNotification(alarm) {
    const dateObj = new Date(alarm.datetime);
    const timeString = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const notification = document.createElement('div');
    notification.className = 'alarm-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h2>⏰ ALARM!</h2>
            <p>It's ${timeString}</p>
            <button onclick="dismissAlarm(this)">Stop Alarm</button>
        </div>
    `;

    document.body.appendChild(notification);
}

// 알람 해제 함수
function dismissAlarm(button) {
    const notification = button.closest('.alarm-notification');
    notification.remove();

    // 알람 소리 중지
    stopAlarmSound();
}

// 알람 소리 관련 전역 변수
let alarmAudioContext = null;
let alarmOscillator = null;
let alarmGainNode = null;
let alarmInterval = null;

// 알람 소리 재생 함수 (무한 반복)
function playAlarmSoundLoop() {
    try {
        // 기존 소리 중지
        stopAlarmSound();

        // 새로운 오디오 컨텍스트 생성
        alarmAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        alarmOscillator = alarmAudioContext.createOscillator();
        alarmGainNode = alarmAudioContext.createGain();

        alarmOscillator.connect(alarmGainNode);
        alarmGainNode.connect(alarmAudioContext.destination);

        // 경쾌한 멜로디 패턴 생성
        const melody = [
            { freq: 800, duration: 0.15 },
            { freq: 1000, duration: 0.15 },
            { freq: 1200, duration: 0.15 },
            { freq: 1000, duration: 0.15 },
            { freq: 800, duration: 0.15 },
            { freq: 600, duration: 0.3 }
        ];

        let currentTime = alarmAudioContext.currentTime;
        let patternIndex = 0;

        function playNextNote() {
            if (!alarmOscillator || !alarmGainNode) return;

            const note = melody[patternIndex % melody.length];
            alarmOscillator.frequency.setValueAtTime(note.freq, currentTime);
            alarmGainNode.gain.setValueAtTime(0.15, currentTime);
            alarmGainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

            currentTime += note.duration;
            patternIndex++;

            // 다음 노트 예약 (무한 반복)
            alarmInterval = setTimeout(playNextNote, note.duration * 1000);
        }

        alarmOscillator.type = 'square';
        alarmOscillator.start(currentTime);
        playNextNote();

    } catch (error) {
        console.log('Audio not supported');
    }
}

// 알람 소리 중지 함수
function stopAlarmSound() {
    if (alarmInterval) {
        clearTimeout(alarmInterval);
        alarmInterval = null;
    }

    if (alarmOscillator) {
        try {
            alarmOscillator.stop();
        } catch (e) {
            // 이미 중지된 경우
        }
        alarmOscillator = null;
    }

    if (alarmGainNode) {
        alarmGainNode = null;
    }

    if (alarmAudioContext) {
        alarmAudioContext.close();
        alarmAudioContext = null;
    }
}

// 알람 소리 재생 함수 (단일 재생용)
function playAlarmSound() {
    // 기존 함수는 유지 (호환성 위해)
    playAlarmSoundLoop();
}

// 저장된 알람 로드 함수
function loadSavedAlarms() {
    const alarms = getSavedAlarms();
    alarms.forEach(alarm => {
        displayAlarm(alarm);
        if (alarm.active) {
            scheduleAlarm(alarm);
        }
    });
}

// 저장된 알람 가져오기 함수
function getSavedAlarms() {
    const saved = localStorage.getItem('alarms');
    return saved ? JSON.parse(saved) : [];
}

// 브라우저 알림 권한 요청
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// 모달 현재 시간 표시 함수들
function startModalTimeDisplay() {
    updateModalCurrentTime();
    modalTimeInterval = setInterval(updateModalCurrentTime, 1000);
}

function stopModalTimeDisplay() {
    if (modalTimeInterval) {
        clearInterval(modalTimeInterval);
        modalTimeInterval = null;
    }
}

function updateModalCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    const modalTimeElement = document.getElementById('modal-current-time');
    if (modalTimeElement) {
        modalTimeElement.textContent = timeString;
    }
}

// 7세그먼트 디스플레이 함수
function displayDigit(digitId, number) {
    const digitElement = document.getElementById(digitId);
    digitElement.innerHTML = ''; // 기존 세그먼트 제거

    // 각 숫자에 대한 세그먼트 패턴 정의
    const segmentPatterns = {
        '0': ['a', 'b', 'c', 'd', 'e', 'f'],
        '1': ['b', 'c'],
        '2': ['a', 'b', 'd', 'e', 'g'],
        '3': ['a', 'b', 'c', 'd', 'g'],
        '4': ['b', 'c', 'f', 'g'],
        '5': ['a', 'c', 'd', 'f', 'g'],
        '6': ['a', 'c', 'd', 'e', 'f', 'g'],
        '7': ['a', 'b', 'c'],
        '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        '9': ['a', 'b', 'c', 'd', 'f', 'g']
    };

    const pattern = segmentPatterns[number] || [];

    // 모든 세그먼트 생성 (a-g)
    const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    segments.forEach(segment => {
        const segmentElement = document.createElement('div');
        segmentElement.className = `segment ${segment}`;
        if (pattern.includes(segment)) {
            segmentElement.style.opacity = '1';
        } else {
            segmentElement.style.opacity = '0.05'; // 더 어둡게 변경
        }
        digitElement.appendChild(segmentElement);
    });
}
