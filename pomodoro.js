// =====================================
// StudyMate - Pomodoro JavaScript
// =====================================


// =====================================
// GET ELEMENTS
// =====================================

const minutesDisplay =
    document.getElementById("minutes");

const secondsDisplay =
    document.getElementById("seconds");

const startBtn =
    document.getElementById("startBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const resetBtn =
    document.getElementById("resetBtn");

const sessionText =
    document.getElementById("sessionText");

const completedSessions =
    document.getElementById("completedSessions");

const focusBtn =
    document.getElementById("focusBtn");

const shortBreakBtn =
    document.getElementById("shortBreakBtn");

const longBreakBtn =
    document.getElementById("longBreakBtn");

const themeBtn =
    document.getElementById("themeBtn");

const currentModeDisplay =
    document.getElementById("currentMode");

const todayFocusTime =
    document.getElementById("todayFocusTime");

const cycleCount =
    document.getElementById("cycleCount");

const cycleText =
    document.getElementById("cycleText");

const timerProgressBar =
    document.getElementById("timerProgressBar");

const timerStatus =
    document.getElementById("timerStatus");

const cycleDots =
    document.querySelectorAll(".cycle-dot");


// =====================================
// TIMER SETTINGS
// =====================================

const modes = {

    focus: {
        minutes: 25,
        text: "Time to focus 🎯",
        title: "🎯 Focus Time"
    },

    shortBreak: {
        minutes: 5,
        text: "Take a short break ☕",
        title: "☕ Short Break"
    },

    longBreak: {
        minutes: 15,
        text: "Take a long break 🧘",
        title: "🧘 Long Break"
    }

};


// =====================================
// TIMER VARIABLES
// =====================================

let currentMode = "focus";

let timeLeft =
    modes.focus.minutes * 60;

let timer = null;

let isRunning = false;


// =====================================
// SAVED DATA
// =====================================

let sessions =
    Number(
        localStorage.getItem(
            "studyMateCompletedSessions"
        )
    ) || 0;


let cycleSessions =
    Number(
        localStorage.getItem(
            "studyMatePomodoroCycle"
        )
    ) || 0;


let focusMinutesToday =
    Number(
        localStorage.getItem(
            "studyMateTodayFocusMinutes"
        )
    ) || 0;


let savedDate =
    localStorage.getItem(
        "studyMateFocusDate"
    );


const today =
    new Date().toISOString().split("T")[0];


// Reset today's minutes if date changed

if (savedDate !== today) {

    focusMinutesToday = 0;

    localStorage.setItem(
        "studyMateTodayFocusMinutes",
        "0"
    );

    localStorage.setItem(
        "studyMateFocusDate",
        today
    );

}


// =====================================
// SAVE TIMER DATA
// =====================================

function savePomodoroData() {

    localStorage.setItem(
        "studyMateCompletedSessions",
        sessions
    );


    localStorage.setItem(
        "studyMatePomodoroCycle",
        cycleSessions
    );


    localStorage.setItem(
        "studyMateTodayFocusMinutes",
        focusMinutesToday
    );


    localStorage.setItem(
        "studyMateFocusDate",
        today
    );

}


// =====================================
// UPDATE TIMER DISPLAY
// =====================================

function updateDisplay() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    minutesDisplay.textContent =
        String(minutes).padStart(2, "0");


    secondsDisplay.textContent =
        String(seconds).padStart(2, "0");


    updateProgress();

}


// =====================================
// UPDATE TIMER PROGRESS
// =====================================

function updateProgress() {

    const totalSeconds =
        modes[currentMode].minutes * 60;


    const elapsed =
        totalSeconds - timeLeft;


    const percentage =
        (elapsed / totalSeconds) * 100;


    timerProgressBar.style.width =
        `${Math.min(100, Math.max(0, percentage))}%`;

}


// =====================================
// UPDATE STATISTICS
// =====================================

function updateStatistics() {

    completedSessions.textContent =
        sessions;


    todayFocusTime.textContent =
        formatFocusTime(focusMinutesToday);


    cycleCount.textContent =
        `${cycleSessions} / 4`;


    cycleText.textContent =
        `${cycleSessions} / 4`;


    cycleDots.forEach(function(dot, index) {

        if (index < cycleSessions) {

            dot.classList.add("completed");

        } else {

            dot.classList.remove("completed");

        }

    });

}


// =====================================
// FORMAT FOCUS TIME
// =====================================

function formatFocusTime(minutes) {

    if (minutes < 60) {

        return `${minutes}m`;

    }


    const hours =
        Math.floor(minutes / 60);

    const remainingMinutes =
        minutes % 60;


    if (remainingMinutes === 0) {

        return `${hours}h`;

    }


    return `${hours}h ${remainingMinutes}m`;

}


// =====================================
// START TIMER
// =====================================

function startTimer() {

    if (isRunning) {
        return;
    }


    isRunning = true;


    startBtn.disabled = true;

    pauseBtn.disabled = false;


    timerStatus.textContent =
        "Timer is running... 🔥";


    timer =
        setInterval(function() {

            if (timeLeft > 0) {

                timeLeft--;

                updateDisplay();

            } else {

                clearInterval(timer);

                timer = null;

                isRunning = false;

                timerFinished();

            }

        }, 1000);

}


// =====================================
// PAUSE TIMER
// =====================================

function pauseTimer() {

    if (!isRunning) {
        return;
    }


    clearInterval(timer);

    timer = null;

    isRunning = false;


    startBtn.disabled = false;

    pauseBtn.disabled = true;


    timerStatus.textContent =
        "Timer paused ⏸️";

}


// =====================================
// RESET TIMER
// =====================================

function resetTimer() {

    clearInterval(timer);

    timer = null;

    isRunning = false;


    timeLeft =
        modes[currentMode].minutes * 60;


    startBtn.disabled = false;

    pauseBtn.disabled = true;


    timerStatus.textContent =
        "Ready to start";


    updateDisplay();

}


// =====================================
// TIMER FINISHED
// =====================================

function timerFinished() {

    startBtn.disabled = false;

    pauseBtn.disabled = true;


    timerStatus.textContent =
        "Session completed! 🎉";


    // =================================
    // FOCUS COMPLETED
    // =================================

    if (currentMode === "focus") {

        sessions++;

        cycleSessions++;

        focusMinutesToday +=
            modes.focus.minutes;


        // Four sessions completed
        if (cycleSessions >= 4) {

            cycleSessions = 4;

        }


        savePomodoroData();

        updateStatistics();


        playNotificationSound();


        alert(
            "Focus session completed! 🎉\n\nTake a break and relax."
        );


        // Automatically select long break
        if (cycleSessions === 4) {

            switchMode("longBreak");

        } else {

            switchMode("shortBreak");

        }


        return;

    }


    // =================================
    // BREAK COMPLETED
    // =================================

    playNotificationSound();


    alert(
        "Break finished! 📚\n\nReady to study?"
    );


    // Reset cycle after long break
    if (currentMode === "longBreak") {

        cycleSessions = 0;

        savePomodoroData();

        updateStatistics();

    }


    switchMode("focus");

}


// =====================================
// SWITCH MODE
// =====================================

function switchMode(mode) {

    clearInterval(timer);

    timer = null;

    isRunning = false;


    currentMode = mode;


    timeLeft =
        modes[mode].minutes * 60;


    sessionText.textContent =
        modes[mode].text;


    currentModeDisplay.textContent =
        modes[mode].title;


    startBtn.disabled = false;

    pauseBtn.disabled = true;


    timerStatus.textContent =
        "Ready to start";


    // Remove active classes

    focusBtn.classList.remove(
        "active-mode"
    );

    shortBreakBtn.classList.remove(
        "active-mode"
    );

    longBreakBtn.classList.remove(
        "active-mode"
    );


    // Add active class

    if (mode === "focus") {

        focusBtn.classList.add(
            "active-mode"
        );

    }


    if (mode === "shortBreak") {

        shortBreakBtn.classList.add(
            "active-mode"
        );

    }


    if (mode === "longBreak") {

        longBreakBtn.classList.add(
            "active-mode"
        );

    }


    updateDisplay();

}


// =====================================
// NOTIFICATION SOUND
// =====================================

function playNotificationSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return;
        }


        const audioContext =
            new AudioContext();


        const oscillator =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        oscillator.connect(gain);

        gain.connect(audioContext.destination);


        oscillator.frequency.value =
            800;


        gain.gain.value =
            0.08;


        oscillator.start();


        oscillator.stop(
            audioContext.currentTime + 0.25
        );

    } catch (error) {

        console.log(
            "Notification sound unavailable."
        );

    }

}


// =====================================
// BUTTON EVENTS
// =====================================

startBtn.addEventListener(
    "click",
    startTimer
);


pauseBtn.addEventListener(
    "click",
    pauseTimer
);


resetBtn.addEventListener(
    "click",
    resetTimer
);


focusBtn.addEventListener(
    "click",
    function() {

        switchMode("focus");

    }
);


shortBreakBtn.addEventListener(
    "click",
    function() {

        switchMode("shortBreak");

    }
);


longBreakBtn.addEventListener(
    "click",
    function() {

        switchMode("longBreak");

    }
);


// =====================================
// DARK MODE
// =====================================

function loadTheme() {

    const theme =
        localStorage.getItem(
            "studyMateTheme"
        );


    if (theme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent =
            "☀️ Light Mode";

    } else {

        themeBtn.textContent =
            "🌙 Dark Mode";

    }

}


themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            localStorage.setItem(
                "studyMateTheme",
                "dark"
            );


            themeBtn.textContent =
                "☀️ Light Mode";

        } else {

            localStorage.setItem(
                "studyMateTheme",
                "light"
            );


            themeBtn.textContent =
                "🌙 Dark Mode";

        }

    }
);


// =====================================
// INITIALIZE
// =====================================

updateStatistics();

updateDisplay();

loadTheme();

pauseBtn.disabled = true;