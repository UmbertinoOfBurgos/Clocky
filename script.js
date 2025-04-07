// Get DOM elements
const time1Display = document.getElementById('time-1');
const time2Display = document.getElementById('time-2');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const player1Div = document.getElementById('player-1-area'); 
const player2Div = document.getElementById('player-2-area'); 

// Time setup elements
const presetButtons = document.querySelectorAll('.preset-button');
const customMinutesInput = document.getElementById('custom-minutes');
const setCustomTimeButton = document.getElementById('set-custom-time');

// Timer variables
let initialTime = 10 * 60; // Default: 10 minutes in seconds
let time1 = initialTime;
let time2 = initialTime;
let activePlayer = 1; // 1 or 2
let timerInterval = null;
let isRunning = false;
const lowTimeThreshold = 30; 

// --- Helper Functions ---

// Format seconds into MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Update the display for both timers, including low time warning
function updateDisplay() {
    time1Display.textContent = formatTime(time1);
    time2Display.textContent = formatTime(time2);

    // Add/remove low-time class
    if (time1 <= lowTimeThreshold) {
        time1Display.classList.add('low-time');
    } else {
        time1Display.classList.remove('low-time');
    }
    if (time2 <= lowTimeThreshold) {
        time2Display.classList.add('low-time');
    } else {
        time2Display.classList.remove('low-time');
    }
}

// Set the initial time for the game (used by presets and custom input)
function setInitialTime(minutes) {
    if (isRunning) return; 
    const newTime = parseInt(minutes, 10);
    if (isNaN(newTime) || newTime < 1) {
        alert("Please enter a valid number of minutes (1 or more).");
        return;
    }
    initialTime = newTime * 60;
    customMinutesInput.value = newTime; 
    resetGame(); 
    console.log(`Initial time set to ${newTime} minutes`);
}

// Switch active player and update UI
function switchPlayer() {
    if (!isRunning) return; 

    activePlayer = activePlayer === 1 ? 2 : 1;

    updatePlayerStyles(); 
    // Restart the interval for the new active player
    startTimer();
}

// Stop the timer interval
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Start the timer interval for the active player
function startTimer() {
    stopTimer(); 

    timerInterval = setInterval(() => {
        if (activePlayer === 1) {
            time1--;
            if (time1 <= 0) {
                time1 = 0;
                gameOver(1);
            }
        } else {
            time2--;
            if (time2 <= 0) {
                time2 = 0;
                gameOver(2);
            }
        }
        updateDisplay();
    }, 1000); 
}

// Updates player div classes based on game state (active, running)
function updatePlayerStyles() {
    // Base active/inactive classes
    player1Div.classList.toggle('active', activePlayer === 1);
    player2Div.classList.toggle('active', activePlayer === 2)

    // Add 'running' class only if game is running AND the player is active
    player1Div.classList.toggle('running', isRunning && activePlayer === 1);
    player2Div.classList.toggle('running', isRunning && activePlayer === 2);
}

// Handle game over
function gameOver(losingPlayer) {
    stopTimer();
    isRunning = false;
    startPauseButton.textContent = 'Start';
    startPauseButton.disabled = true; // Disable start after game over
    document.body.classList.remove('game-running'); // Exit fullscreen mode
    player1Div.classList.remove('running'); // Remove tappable indicator
    player2Div.classList.remove('running'); // Remove tappable indicator
    alert(`Player ${losingPlayer} ran out of time!`);
    // Can add more visual indication here, like changing background
}

// Reset the game state
function resetGame() {
    stopTimer();
    time1 = initialTime;
    time2 = initialTime;
    activePlayer = 1; 
    isRunning = false;
    updateDisplay(); // Also resets low-time class
    startPauseButton.textContent = 'Start';
    startPauseButton.disabled = false; // Re-enable start button
    document.body.classList.remove('game-running'); // Ensure setup mode on reset
    updatePlayerStyles(); // Reset player styles (P1 active, not running)
}

// --- Event Listeners ---

startPauseButton.addEventListener('click', () => {
    if (isRunning) {
        // Pause
        stopTimer();
        isRunning = false;
        startPauseButton.textContent = 'Resume';
        // Disable switch 'buttons' (player divs) when paused
    } else {
        // Start or Resume
        // Prevent starting if a player has already lost
        document.body.classList.add('game-running'); // Enter fullscreen mode
        if (time1 <= 0 || time2 <= 0) {
            resetGame(); // Reset if trying to start a finished game
        }
        isRunning = true;
        startPauseButton.textContent = 'Pause';
        // Enable the correct switch 'button' (player div)
        startTimer();
    }
    updatePlayerStyles(); // Update styles for running state change
});

resetButton.addEventListener('click', resetGame);

// Add listeners to player divs instead of buttons
player1Div.addEventListener('click', () => {
    if (isRunning && activePlayer === 1) {
        switchPlayer();
    }
});

player2Div.addEventListener('click', () => {
    if (isRunning && activePlayer === 2) {
        switchPlayer();
    }
});

// Listeners for time setup
presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        setInitialTime(button.dataset.minutes);
    });
});

setCustomTimeButton.addEventListener('click', () => {
    setInitialTime(customMinutesInput.value);
});

customMinutesInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setInitialTime(customMinutesInput.value);
    }
});


// --- Initial Setup ---
resetGame(); 
