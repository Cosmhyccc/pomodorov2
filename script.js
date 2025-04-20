// DOM Elements
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const timerLabelEl = document.getElementById('timer-label');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const focusTimeInput = document.getElementById('focus-time');
const breakTimeInput = document.getElementById('break-time');
const timerContainer = document.querySelector('.timer-container');
const progressRing = document.querySelector('.progress-ring-circle');

// Timer variables
let timer;
let isRunning = false;
let isPaused = false;
let isBreak = false;
let minutes = parseInt(focusTimeInput.value);
let seconds = 0;
let totalSeconds = minutes * 60;
let elapsedSeconds = 0;
let circumference = 2 * Math.PI * 110; // Circle radius * 2π

// Initialize progress ring
progressRing.style.strokeDasharray = `${circumference}px`;
progressRing.style.strokeDashoffset = '0';

// Update timer display
function updateTimerDisplay() {
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
}

// Update progress ring
function updateProgress() {
    const progress = elapsedSeconds / totalSeconds;
    const dashoffset = circumference * (1 - progress);
    progressRing.style.strokeDashoffset = dashoffset;
}

// Start timer
function startTimer() {
    if (isRunning && !isPaused) return;

    isRunning = true;
    isPaused = false;
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');

    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                isRunning = false;
                playAlarmSound();
                switchMode();
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        elapsedSeconds++;
        updateTimerDisplay();
        updateProgress();
    }, 1000);
}

// Pause timer
function pauseTimer() {
    if (!isRunning) return;

    isPaused = true;
    clearInterval(timer);
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
}

// Reset timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    
    if (isBreak) {
        switchMode();
    } else {
        minutes = parseInt(focusTimeInput.value);
        seconds = 0;
        totalSeconds = minutes * 60;
        elapsedSeconds = 0;
    }
    
    updateTimerDisplay();
    updateProgress();
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
}

// Switch between focus and break mode
function switchMode() {
    isBreak = !isBreak;
    
    if (isBreak) {
        timerContainer.classList.add('break');
        timerLabelEl.textContent = 'BREAK TIME';
        minutes = parseInt(breakTimeInput.value);
    } else {
        timerContainer.classList.remove('break');
        timerLabelEl.textContent = 'FOCUS TIME';
        minutes = parseInt(focusTimeInput.value);
    }
    
    seconds = 0;
    totalSeconds = minutes * 60;
    elapsedSeconds = 0;
    updateTimerDisplay();
    updateProgress();
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
}

// Play an alarm sound when timer finishes
function playAlarmSound() {
    const audio = new Audio('https://soundbible.com/grab.php?id=2061&type=mp3');
    audio.play().catch(err => console.log('Audio could not be played', err));
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Input validation for focus time
focusTimeInput.addEventListener('input', (e) => {
    // Remove any non-numeric characters
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    // Update input value with clean value
    e.target.value = value;
    
    // Validate min and max
    if (value !== '') {
        const numValue = parseInt(value);
        if (numValue < 1) e.target.value = '1';
        if (numValue > 60) e.target.value = '60';
    }
});

// Input validation for break time
breakTimeInput.addEventListener('input', (e) => {
    // Remove any non-numeric characters
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    // Update input value with clean value
    e.target.value = value;
    
    // Validate min and max
    if (value !== '') {
        const numValue = parseInt(value);
        if (numValue < 1) e.target.value = '1';
        if (numValue > 30) e.target.value = '30';
    }
});

focusTimeInput.addEventListener('change', () => {
    if (!isRunning && !isBreak) {
        // Ensure we have a valid value
        if (focusTimeInput.value === '' || parseInt(focusTimeInput.value) < 1) {
            focusTimeInput.value = '1';
        }
        
        minutes = parseInt(focusTimeInput.value);
        totalSeconds = minutes * 60;
        updateTimerDisplay();
    }
});

breakTimeInput.addEventListener('change', () => {
    if (!isRunning && isBreak) {
        // Ensure we have a valid value
        if (breakTimeInput.value === '' || parseInt(breakTimeInput.value) < 1) {
            breakTimeInput.value = '1';
        }
        
        minutes = parseInt(breakTimeInput.value);
        totalSeconds = minutes * 60;
        updateTimerDisplay();
    }
});

// Initialize timer display
updateTimerDisplay();
