onst container = document.getElementById('app-container');
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

    let x, y;
    
    // [원인 해결] e.touches 뒤에 첫 번째 손가락을 뜻하는 을 정확히 추가했습니다!
    if (e.touches && e.touches.length > 0) {
        x = e.touches.clientX;
        y = e.touches.clientY;
    } else {
        // PC 마우스 클릭 대응
        x = e.clientX;
        y = e.clientY;
    }

    const circle = document.createElement('div');
    circle.classList.add('circle');
    
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F1C', '#8338EC'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 50 + 50; 
    const radius = size / 2; 

    // [잔상 해결] 원이 화면 밖으로 나가지 않도록 반지름(radius)만큼 화면 안쪽에서만 생성되게 제한합니다.
    x = Math.max(radius, Math.min(x, window.innerWidth - radius));
    y = Math.max(radius, Math.min(y, window.innerHeight - radius));

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.backgroundColor = randomColor;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    container.appendChild(circle);

    // 애니메이션 완료 후 객체를 확실하게 제거하여 잔상을 방지합니다.
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