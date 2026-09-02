const container = document.getElementById('app-container');
const timeCountElement = document.getElementById('time-count');
const touchCountElement = document.getElementById('touch-count');

let touchCount = 0;
let startTime = Date.now();

// 1. 밀리초 단위 타이머 (00:00:00 포맷)
function updateTime() {
    const elapsedTime = Date.now() - startTime;
    
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10); 

    const formattedMin = String(minutes).padStart(2, '0');
    const formattedSec = String(seconds).padStart(2, '0');
    const formattedMs = String(milliseconds).padStart(2, '0');

    timeCountElement.innerText = `${formattedMin}:${formattedSec}:${formattedMs}`;
    requestAnimationFrame(updateTime); 
}
updateTime();

// 2. 비눗방울 소리 생성기 (사파리 호환성 강화)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playBubbleSound() {
    // 사파리 오디오 잠금 확실하게 해제
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

// 3. 터치 시 실행되는 함수
function createCircle(e) {
    touchCount++;
    touchCountElement.innerText = touchCount;

    // 소리 재생
    playBubbleSound();

    // 햅틱 코드는 웹에서 동작하지 않지만 추후를 위해 남겨둡니다.
    if (navigator.vibrate) {
        navigator.vibrate(50); 
    }

    // [버그 완벽 수정] e.touches을 추가하여 첫 번째 터치 좌표를 정확하게 가져옵니다.
    let x, y;
    if (e.touches && e.touches.length > 0) {
        x = e.touches.clientX;
        y = e.touches.clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

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

    // 잔상 방지: 애니메이션이 끝나면 DOM에서 요소를 확실하게 제거
    circle.addEventListener('animationend', () => {
        circle.remove();
    });
}

// 4. 이벤트 등록 (사파리 터치 충돌 방지 코드 추가)
container.addEventListener('touchstart', function(e) {
    e.preventDefault(); // 아이폰의 기본 제스처(새로고침 등) 작동을 막아줍니다.
    createCircle(e);
}, { passive: false });

container.addEventListener('mousedown', createCircle);