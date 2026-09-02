const container = document.getElementById('app-container');
const timeCountElement = document.getElementById('time-count');
const touchCountElement = document.getElementById('touch-count');

let touchCount = 0;
let startTime = Date.now();

// [수정 2] 밀리초 단위 타이머 (00:00:00 포맷)
function updateTime() {
    const elapsedTime = Date.now() - startTime;
    
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    // 00 포맷에 맞추기 위해 밀리초를 10으로 나누어 두 자리로 표현 (10ms 단위)
    const milliseconds = Math.floor((elapsedTime % 1000) / 10); 

    const formattedMin = String(minutes).padStart(2, '0');
    const formattedSec = String(seconds).padStart(2, '0');
    const formattedMs = String(milliseconds).padStart(2, '0');

    timeCountElement.innerText = `${formattedMin}:${formattedSec}:${formattedMs}`;
    
    // 부드러운 밀리초 카운팅을 위해 애니메이션 프레임 사용
    requestAnimationFrame(updateTime); 
}
updateTime(); // 타이머 시작

// [수정 3] 비눗방울 터지는 소리 생성기 (파일 필요 없음)
// 사파리 지원을 위해 webkitAudioContext 포함
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBubbleSound() {
    // 아이폰 사파리 정책상 첫 터치 시 오디오를 깨워줘야 함
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    // 높은 주파수에서 순식간에 낮은 주파수로 떨어지며 '퐁' 소리를 구현
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

// 화면을 터치(또는 클릭)했을 때 실행되는 함수
function createCircle(e) {
    // [수정 1] 터치 횟수 증가 및 영문(Hit)에 반영
    touchCount++;
    touchCountElement.innerText = touchCount;

    // 비눗방울 소리 재생
    playBubbleSound();

    // 햅틱 코드는 남겨두지만 아이폰 사파리에서는 작동하지 않음
    if (navigator.vibrate) {
        navigator.vibrate(50); 
    }

    // 터치 좌표 가져오기
    const x = (e.touches && e.touches.length > 0) ? e.touches.clientX : e.clientX;
    const y = (e.touches && e.touches.length > 0) ? e.touches.clientY : e.clientY;

    const circle = document.createElement('div');
    circle.classList.add('circle');
    
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F1C', '#8338EC'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 50 + 50; 

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.backgroundColor = randomColor;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    container.appendChild(circle);
}

// 터치 이벤트 등록
container.addEventListener('touchstart', createCircle);
container.addEventListener('mousedown', createCircle);