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

// 2. 비눗방울 소리 생성기
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playBubbleSound() {
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

    playBubbleSound();

    // [완벽 해결 1] e.touches으로 정확히 '첫 번째 손가락' 좌표 가져오기
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
    const radius = size / 2; // 원의 반지름

    // [완벽 해결 2] 원이 화면(모서리) 밖으로 나가지 않도록 좌표 범위 제한 (패딩 적용)
    x = Math.max(radius, Math.min(x, window.innerWidth - radius));
    y = Math.max(radius, Math.min(y, window.innerHeight - radius));

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.backgroundColor = randomColor;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    container.appendChild(circle);

    // [완벽 해결 3] 애니메이션 완료 후 잔상 없이 확실하게 요소 제거
    circle.addEventListener('animationend', () => {
        circle.remove();
    });
}

// 4. 이벤트 등록
container.addEventListener('touchstart', function(e) {
    e.preventDefault();
    createCircle(e);
}, { passive: false });

container.addEventListener('mousedown', createCircle);
```

### 2. 최종 수정된 `style.css` (전체 복사)
비눗방울이 화면 바깥으로 나가는 것을 방지하고, 넘치는 요소를 깔끔하게 숨겨주는 스타일 속성을 추가했습니다 [1].

```css
/* 화면 전체를 꽉 채우고 스크롤 및 잔상 방지 */
body, html {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    background-color: #f0f8ff;
    
    /* [완벽 해결 4] 뷰포트 overflow 영역 노출 완전 차단 및 고정 */
    overflow: hidden;
    position: fixed; 
    
    user-select: none; 
    -webkit-user-select: none;
    touch-action: none; 
}

#app-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

.circle {
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pop 0.5s ease-out forwards;
}

@keyframes pop {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
}

#info-panel {
    position: absolute;
    bottom: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    box-sizing: border-box;
    font-size: 24px;
    font-weight: bold;
    color: #555;
    z-index: 10;
    pointer-events: none; 
    font-family: sans-serif;
}