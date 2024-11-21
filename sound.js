const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

// 사이즈 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let waveAmplitude = 0.5; // 파동의 진폭 (0과 1 사이)
let waveFrequency = 1; // 기본 주파수 (Hz)
let phaseShift = 0; // 시간에 따른 위상 이동

// 오디오 컨텍스트 설정
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = audioContext.createOscillator(); // 오실레이터 생성
let gainNode = audioContext.createGain(); // 게인 노드 생성

// 오실레이터와 게인 노드 연결
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

// 오실레이터 설정
oscillator.type = 'sine'; // 사인파 형태
oscillator.frequency.setValueAtTime(waveFrequency, audioContext.currentTime); // 주파수 설정
gainNode.gain.setValueAtTime(waveAmplitude, audioContext.currentTime); // 볼륨 설정

// 소리 시작
oscillator.start();

// 파동 그리기 함수
function drawWave() {
    // 배경을 검은색으로 설정
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 파동 그리기
    ctx.beginPath();
    const centerY = canvas.height / 2; // 화면 중앙 Y 좌표
    const waveLength = canvas.width / (waveFrequency * 10); // 주파수에 따른 파동 길이 조정

    for (let x = 0; x < canvas.width; x++) {
        // 단일 선 형태의 물결 파동 수식
        const y = centerY + (waveAmplitude * (canvas.height / 4)) * Math.sin((x / waveLength) * Math.PI * 2 + phaseShift);
        if (x === 0) {
            ctx.moveTo(x, y); // 시작점 설정
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.strokeStyle = '#b08d3e'; // 파동 색상
    ctx.lineWidth = 2; // 선 두께
    ctx.stroke();
    
    // 파동 업데이트
    phaseShift += 0.05; // 위상 이동
    requestAnimationFrame(drawWave);
}

drawWave();

// 화면 리사이즈 대응
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 버튼 이벤트 리스너
document.getElementById('increaseAmplitude').addEventListener('click', () => {
    waveAmplitude = Math.min(1, waveAmplitude + 0.1); // 진폭 증가 (최대 1)
    gainNode.gain.setValueAtTime(waveAmplitude, audioContext.currentTime); // 볼륨 증가
});

document.getElementById('decreaseAmplitude').addEventListener('click', () => {
    waveAmplitude = Math.max(0, waveAmplitude - 0.1); // 진폭 감소 (최소 0)
    gainNode.gain.setValueAtTime(waveAmplitude, audioContext.currentTime); // 볼륨 감소
});

document.getElementById('increaseFrequency').addEventListener('click', () => {
    waveFrequency += 1; // 주파수 증가
    oscillator.frequency.setValueAtTime(waveFrequency * 440, audioContext.currentTime); // 주파수 변경
});

document.getElementById('decreaseFrequency').addEventListener('click', () => {
    waveFrequency = Math.max(1, waveFrequency - 1); // 주파수 감소 (최소 1)
    oscillator.frequency.setValueAtTime(waveFrequency * 440, audioContext.currentTime); // 주파수 변경
});