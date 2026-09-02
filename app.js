const container = document.getElementById('app-container');
const timeCountElement = document.getElementById('time-count');
const touchCountElement = document.getElementById('touch-count');

let touchCount = 0;
let playTime = 0;

// 1. 사용 시간 카운팅 (앱 실행 후 1초마다 증가)
setInterval(() => {
    playTime++;
    timeCountElement.innerText = playTime;
}, 1000);

// 화면을 터치(또는 클릭)했을 때 실행되는 함수
function createCircle(e) {
    // 2. 터치 횟수 증가
    touchCount++;
    touchCountElement.innerText = touchCount;

    // 3. 햅틱 반응 (진동) 발생
    if (navigator.vibrate) {
        navigator.vibrate(50); 
    }

    // [핵심 버그 수정 완료] e.touches 뒤에 첫 번째 터치()를 정확히 지정!
    const x = (e.touches && e.touches.length > 0) ? e.touches.clientX : e.clientX;
    const y = (e.touches && e.touches.length > 0) ? e.touches.clientY : e.clientY;

    const circle = document.createElement('div');
    circle.classList.add('circle');
    
    // 무작위 색상과 크기 지정
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F1C', '#8338EC'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 50 + 50; 

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.backgroundColor = randomColor;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    container.appendChild(circle);

    // 애니메이션이 완료된 후 잔상 없이 확실하게 요소 삭제
    circle.addEventListener('animationend', () => {
        circle.remove();
    });
}

// 터치 이벤트 등록
container.addEventListener('touchstart', createCircle);
container.addEventListener('mousedown', createCircle);