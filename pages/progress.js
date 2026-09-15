// =====================================
// StudyMate - Progress JavaScript
// =====================================


// =====================================
// GET SAVED DATA
// =====================================

let tasks =
    JSON.parse(
        localStorage.getItem("studyMateTasks")
    ) || [];


let pomodoroSessions =
    Number(
        localStorage.getItem(
            "studyMateCompletedSessions"
        )
    ) || 0;


let notes =
    JSON.parse(
        localStorage.getItem("studyMateNotes")
    ) || [];


let studySessions =
    JSON.parse(
        localStorage.getItem("studyMateSessions")
    ) || [];


// =====================================
// GET ELEMENTS
// =====================================

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const pomodoroSessionsElement =
    document.getElementById("pomodoroSessions");

const overallProgress =
    document.getElementById("overallProgress");

const completedPercent =
    document.getElementById("completedPercent");

const pendingPercent =
    document.getElementById("pendingPercent");

const completedBar =
    document.getElementById("completedBar");

const pendingBar =
    document.getElementById("pendingBar");

const totalNotes =
    document.getElementById("totalNotes");

const studySessionsElement =
    document.getElementById("studySessions");

const plannedStudyTime =
    document.getElementById("plannedStudyTime");

const productivityScore =
    document.getElementById("productivityScore");

const progressMessage =
    document.getElementById("progressMessage");

const taskInsight =
    document.getElementById("taskInsight");

const pomodoroInsight =
    document.getElementById("pomodoroInsight");

const plannerInsight =
    document.getElementById("plannerInsight");

const notesInsight =
    document.getElementById("notesInsight");

const themeBtn =
    document.getElementById("themeBtn");


// =====================================
// UPDATE PROGRESS
// =====================================

function updateProgress() {

    // Refresh LocalStorage data
    tasks =
        JSON.parse(
            localStorage.getItem("studyMateTasks")
        ) || [];


    notes =
        JSON.parse(
            localStorage.getItem("studyMateNotes")
        ) || [];


    studySessions =
        JSON.parse(
            localStorage.getItem("studyMateSessions")
        ) || [];


    pomodoroSessions =
        Number(
            localStorage.getItem(
                "studyMateCompletedSessions"
            )
        ) || 0;


    // =================================
    // TASK DATA
    // =================================

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed === true;

        }).length;


    const pending =
        total - completed;


    // =================================
    // TASK PERCENTAGE
    // =================================

    let completedPercentage = 0;


    if (total > 0) {

        completedPercentage =
            Math.round(
                (completed / total) * 100
            );

    }


    const pendingPercentage =
        total > 0
            ? 100 - completedPercentage
            : 0;


    // =================================
    // BASIC STATISTICS
    // =================================

    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;


    pomodoroSessionsElement.textContent =
        pomodoroSessions;


    totalNotes.textContent =
        notes.length;


    studySessionsElement.textContent =
        studySessions.length;


    // =================================
    // OVERALL PROGRESS
    // =================================

    overallProgress.textContent =
        completedPercentage + "%";


    completedPercent.textContent =
        completedPercentage + "%";


    pendingPercent.textContent =
        pendingPercentage + "%";


    completedBar.style.width =
        completedPercentage + "%";


    pendingBar.style.width =
        pendingPercentage + "%";


    // =================================
    // PROGRESS CIRCLE - DYNAMIC
    // =================================

    const progressCircle =
        document.querySelector(
            ".progress-circle"
        );


    const completedDegree =
        completedPercentage * 3.6;


    if (progressCircle) {

        // Update CSS custom property
        // 0%   = 0deg
        // 25%  = 90deg
        // 50%  = 180deg
        // 75%  = 270deg
        // 100% = 360deg

        progressCircle.style.setProperty(
            "--progress-deg",
            completedDegree + "deg"
        );

    }


    // =================================
    // PLANNED STUDY TIME
    // =================================

    const totalMinutes =
        calculateStudyMinutes();


    plannedStudyTime.textContent =
        formatStudyTime(totalMinutes);


    // =================================
    // PRODUCTIVITY SCORE
    // =================================

    const score =
        calculateProductivityScore(
            completedPercentage,
            pomodoroSessions,
            studySessions.length,
            notes.length
        );


    productivityScore.textContent =
        score + "%";


    // =================================
    // PROGRESS MESSAGE
    // =================================

    updateProgressMessage(
        completedPercentage
    );


    // =================================
    // INSIGHTS
    // =================================

    updateInsights(
        total,
        completed,
        pending,
        pomodoroSessions,
        studySessions.length,
        notes.length,
        totalMinutes
    );

}


// =====================================
// CALCULATE STUDY MINUTES
// =====================================

function calculateStudyMinutes() {

    let totalMinutes = 0;


    studySessions.forEach(function(session) {

        totalMinutes +=
            durationToMinutes(
                session.duration
            );

    });


    return totalMinutes;

}


// =====================================
// CONVERT DURATION TO MINUTES
// =====================================

function durationToMinutes(duration) {

    if (!duration) {
        return 0;
    }


    const value =
        String(duration)
            .toLowerCase()
            .trim();


    if (
        value.includes("30 minutes")
    ) {

        return 30;

    }


    if (
        value.includes("1 hour")
    ) {

        return 60;

    }


    if (
        value.includes("1.5 hours")
    ) {

        return 90;

    }


    if (
        value.includes("2 hours")
    ) {

        return 120;

    }


    if (
        value.includes("3 hours")
    ) {

        return 180;

    }


    // Handle numeric duration
    const number =
        parseFloat(value);


    if (!isNaN(number)) {

        if (value.includes("hour")) {

            return number * 60;

        }

        return number;

    }


    return 0;

}


// =====================================
// FORMAT STUDY TIME
// =====================================

function formatStudyTime(minutes) {

    if (minutes <= 0) {

        return "0h 0m";

    }


    const hours =
        Math.floor(minutes / 60);


    const remainingMinutes =
        minutes % 60;


    return `${hours}h ${remainingMinutes}m`;

}


// =====================================
// PRODUCTIVITY SCORE
// =====================================

function calculateProductivityScore(
    taskPercentage,
    pomodoros,
    sessionsCount,
    notesCount
) {

    let score = 0;


    // Tasks = maximum 60 points
    score +=
        taskPercentage * 0.6;


    // Pomodoro = maximum 20 points
    score +=
        Math.min(pomodoros, 10) * 2;


    // Planner = maximum 10 points
    score +=
        Math.min(sessionsCount, 5) * 2;


    // Notes = maximum 10 points
    score +=
        Math.min(notesCount, 5) * 2;


    return Math.min(
        100,
        Math.round(score)
    );

}


// =====================================
// PROGRESS MESSAGE
// =====================================

function updateProgressMessage(percentage) {

    if (percentage === 0) {

        progressMessage.textContent =
            "Start completing your tasks 🚀";

    }

    else if (percentage < 30) {

        progressMessage.textContent =
            "Good start! Keep going 💪";

    }

    else if (percentage < 60) {

        progressMessage.textContent =
            "You're making good progress! 🔥";

    }

    else if (percentage < 90) {

        progressMessage.textContent =
            "Excellent work! Keep it up 🌟";

    }

    else if (percentage < 100) {

        progressMessage.textContent =
            "Almost there! Finish strong 🎯";

    }

    else {

        progressMessage.textContent =
            "Amazing! All tasks completed! 🏆";

    }

}


// =====================================
// STUDY INSIGHTS
// =====================================

function updateInsights(
    total,
    completed,
    pending,
    pomodoros,
    plannerCount,
    noteCount,
    studyMinutes
) {


    // =================================
    // TASK INSIGHT
    // =================================

    if (total === 0) {

        taskInsight.textContent =
            "Add some tasks to start tracking your progress.";

    }

    else if (pending === 0) {

        taskInsight.textContent =
            "Excellent! You have completed all your tasks. 🏆";

    }

    else {

        taskInsight.textContent =
            `You completed ${completed} of ${total} tasks. ${pending} task${pending === 1 ? "" : "s"} remaining.`;

    }


    // =================================
    // POMODORO INSIGHT
    // =================================

    if (pomodoros === 0) {

        pomodoroInsight.textContent =
            "Complete Pomodoro sessions to improve your focus.";

    }

    else if (pomodoros === 1) {

        pomodoroInsight.textContent =
            "You've completed 1 focus session. Keep building your focus habit! 🔥";

    }

    else {

        pomodoroInsight.textContent =
            `You've completed ${pomodoros} focus sessions. Great consistency! 🍅`;

    }


    // =================================
    // PLANNER INSIGHT
    // =================================

    if (plannerCount === 0) {

        plannerInsight.textContent =
            "Create study sessions to organize your day.";

    }

    else {

        plannerInsight.textContent =
            `You have ${plannerCount} planned study session${plannerCount === 1 ? "" : "s"} with ${formatStudyTime(studyMinutes)} of study time.`;

    }


    // =================================
    // NOTES INSIGHT
    // =================================

    if (noteCount === 0) {

        notesInsight.textContent =
            "Create notes to keep your important concepts organized.";

    }

    else if (noteCount === 1) {

        notesInsight.textContent =
            "You have 1 study note. Keep building your knowledge library! 📝";

    }

    else {

        notesInsight.textContent =
            `You have ${noteCount} study notes. Your knowledge library is growing! 📚`;

    }

}


// =====================================
// DARK MODE
// =====================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "studyMateTheme"
        );


    if (savedTheme === "dark") {

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

            themeBtn.textContent =
                "☀️ Light Mode";


            localStorage.setItem(
                "studyMateTheme",
                "dark"
            );

        } else {

            themeBtn.textContent =
                "🌙 Dark Mode";


            localStorage.setItem(
                "studyMateTheme",
                "light"
            );

        }

    }
);


// =====================================
// AUTO REFRESH
// =====================================

// Update progress when page becomes visible

document.addEventListener(
    "visibilitychange",
    function() {

        if (!document.hidden) {

            updateProgress();

        }

    }
);


// =====================================
// INITIAL LOAD
// =====================================

loadTheme();

updateProgress();