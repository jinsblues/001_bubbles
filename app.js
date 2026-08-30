const container = document.getElementById('app-container');

// 화면을 터치(또는 클릭)했을 때 실행되는 함수
function createCircle(e) {
    // 모바일 터치 이벤트와 PC 클릭 이벤트 좌표 모두 처리
    const x = e.touches ? e.touches.clientX : e.clientX;
    const y = e.touches ? e.touches.clientY : e.clientY;

    const circle = document.createElement('div');
    circle.classList.add('circle');
    
    // 무작위 색상과 크기 지정
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F1C', '#8338EC'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 50 + 50; // 50px ~ 100px 크기

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.backgroundColor = randomColor;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    container.appendChild(circle);

    // 애니메이션이 끝나면 요소 삭제 (메모리 관리)
    setTimeout(() => {
        circle.remove();
    }, 500);
}

// 터치 이벤트 등록
container.addEventListener('touchstart', createCircle);
container.addEventListener('click', createCircle);