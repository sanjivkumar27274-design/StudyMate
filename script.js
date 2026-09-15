/* =========================================================
   STUDYMATE - DASHBOARD SCRIPT
   ========================================================= */


/* ================= STORAGE KEYS ================= */

const TASKS_KEY = "studyMateTasks";
const NOTES_KEY = "studyMateNotes";
const SESSIONS_KEY = "studyMateSessions";
const POMODORO_KEY = "studyMateCompletedSessions";
const THEME_KEY = "studyMateTheme";


/* ================= HELPER FUNCTIONS ================= */

function getTasks() {
    return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
}

function saveTasks(tasks) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function getNotes() {
    return JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
}

function getSessions() {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];
}

function getPomodoroSessions() {
    return Number(localStorage.getItem(POMODORO_KEY)) || 0;
}

function getToday() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
}


/* ================= DASHBOARD STATISTICS ================= */

function updateDashboard() {

    const tasks = getTasks();

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const progress = total > 0
        ? Math.round((completed / total) * 100)
        : 0;


    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const pendingTasks = document.getElementById("pendingTasks");
    const progressElement = document.getElementById("progress");


    if (totalTasks) {
        totalTasks.textContent = total;
    }

    if (completedTasks) {
        completedTasks.textContent = completed;
    }

    if (pendingTasks) {
        pendingTasks.textContent = pending;
    }

    if (progressElement) {
        progressElement.textContent = `${progress}%`;
    }


    /* Study Progress */

    const studyProgress = document.getElementById("studyProgress");
    const completedProgress =
        document.getElementById("completedProgress");
    const remainingProgress =
        document.getElementById("remainingProgress");


    if (studyProgress) {
        studyProgress.textContent = `${progress}%`;
    }

    if (completedProgress) {
        completedProgress.textContent = `${progress}%`;
    }

    if (remainingProgress) {
        remainingProgress.textContent = `${100 - progress}%`;
    }


  /* ================= PROGRESS CIRCLE ================= */

const progressCircle =
    document.querySelector(".progress-circle");

if (progressCircle) {

    // Calculate completed angle
    const completedDegrees =
        progress * 3.6;

    // Update CSS custom property
    progressCircle.style.setProperty(
        "--progress-deg",
        completedDegrees + "deg"
    );
}

} // CLOSE updateDashboard()



/* ================= TODAY'S TASKS ================= */

function displayTasks() {

    const taskList = document.querySelector(".task-list");

    if (!taskList) {
        return;
    }


    const tasks = getTasks();

    const today = getToday();


    const todayTasks = tasks
        .filter(task => task.date === today)
        .sort((a, b) => {

            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }

            return a.id - b.id;
        })
        .slice(0, 5);


    if (todayTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-task">
                <div>🎉</div>
                <p>No tasks for today</p>
                <small>Enjoy your day or add a new task!</small>
            </div>
        `;

        return;
    }


    taskList.innerHTML = todayTasks.map(task => {

        return `
            <div class="task-item ${task.completed ? "completed" : ""}">

                <div class="task-left">

                    <input
                        type="checkbox"
                        ${task.completed ? "checked" : ""}
                        onchange="toggleDashboardTask(${task.id})"
                    >

                    <div class="task-content">

                        <strong>
                            ${escapeHTML(task.title)}
                        </strong>

                        <span class="task-priority ${escapeHTML(task.priority)}">
                            ${escapeHTML(task.priority)}
                        </span>

                    </div>

                </div>

                <button
                    class="task-delete"
                    onclick="deleteDashboardTask(${task.id})"
                    title="Delete task">
                    🗑️
                </button>

            </div>
        `;

    }).join("");
}


/* ================= COMPLETE TASK ================= */

function toggleDashboardTask(id) {

    const tasks = getTasks();

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {
        return;
    }


    task.completed = !task.completed;

    saveTasks(tasks);

    updateDashboard();
    displayTasks();
}


/* ================= DELETE TASK ================= */

function deleteDashboardTask(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }


    const tasks = getTasks();

    const updatedTasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks(updatedTasks);

    updateDashboard();
    displayTasks();
}


/* ================= ADD TASK ================= */

function openAddTask() {

    window.location.href = "pages/tasks.html";
}


const dashboardAddTask =
    document.getElementById("dashboardAddTask");

if (dashboardAddTask) {

    dashboardAddTask.addEventListener(
        "click",
        openAddTask
    );
}


/* ================= VIEW ALL TASKS ================= */

const viewAllTasks =
    document.getElementById("viewAllTasks");

if (viewAllTasks) {

    viewAllTasks.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/tasks.html";
        }
    );
}


/* ================= TODAY'S SCHEDULE ================= */

function displaySchedule() {

    const scheduleContainer =
        document.getElementById("dashboardSchedule");

    if (!scheduleContainer) {
        return;
    }


    const sessions = getSessions();

    const today = getToday();


    const todaySessions = sessions
        .filter(session => session.date === today)
        .sort((a, b) =>
            String(a.time).localeCompare(
                String(b.time)
            )
        );


    if (todaySessions.length === 0) {

        scheduleContainer.innerHTML = `
            <div class="empty-schedule">

                <div>📅</div>

                <p>No study sessions planned today</p>

                <small>
                    Create a study session in your planner.
                </small>

            </div>
        `;

        return;
    }


    scheduleContainer.innerHTML =
        todaySessions.map(session => {

            return `
                <div class="schedule-item">

                    <div class="schedule-time">
                        ${escapeHTML(session.time)}
                    </div>

                    <div class="schedule-info">

                        <strong>
                            ${escapeHTML(session.subject)}
                        </strong>

                        <span>
                            ${escapeHTML(session.duration)}
                        </span>

                    </div>

                </div>
            `;

        }).join("");
}


/* ================= VIEW PLANNER ================= */

const viewPlanner =
    document.getElementById("viewPlanner");

if (viewPlanner) {

    viewPlanner.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/planner.html";
        }
    );
}


/* ================= ADD SCHEDULE ================= */

const scheduleAddBtn =
    document.getElementById("scheduleAddBtn");

if (scheduleAddBtn) {

    scheduleAddBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/planner.html";
        }
    );
}


/* ================= RECENT NOTES ================= */

function displayRecentNotes() {

    const recentNotes =
        document.getElementById("recentNotes");

    if (!recentNotes) {
        return;
    }


    const notes = getNotes();


    const latestNotes = notes
        .sort((a, b) => {

            return new Date(b.createdAt) -
                new Date(a.createdAt);

        })
        .slice(0, 3);


    if (latestNotes.length === 0) {

        recentNotes.innerHTML = `
            <div class="empty-notes">

                <div>📝</div>

                <p>No notes yet</p>

                <small>
                    Create your first study note.
                </small>

            </div>
        `;

        return;
    }


    recentNotes.innerHTML =
        latestNotes.map(note => {

            const date = note.createdAt
                ? new Date(note.createdAt)
                    .toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    })
                : "";


            return `
                <div class="note-preview">

                    <div class="note-preview-header">

                        <div>

                            <h3>
                                ${escapeHTML(note.title)}
                            </h3>

                            <span class="note-subject">
                                ${escapeHTML(note.subject || "General")}
                            </span>

                        </div>

                        <small>
                            ${date}
                        </small>

                    </div>

                    <p>
                        ${escapeHTML(note.content || "No content available.")}
                    </p>

                </div>
            `;

        }).join("");
}


/* ================= VIEW NOTES ================= */

const viewNotesBtn =
    document.getElementById("viewNotesBtn");

if (viewNotesBtn) {

    viewNotesBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/notes.html";
        }
    );
}


/* ================= QUICK ACTIONS ================= */

const quickAddTask =
    document.getElementById("quickAddTask");

if (quickAddTask) {

    quickAddTask.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/tasks.html";
        }
    );
}


const quickNewNote =
    document.getElementById("quickNewNote");

if (quickNewNote) {

    quickNewNote.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/notes.html";
        }
    );
}


const quickTimer =
    document.getElementById("quickTimer");

if (quickTimer) {

    quickTimer.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/pomodoro.html";
        }
    );
}


const quickPlanner =
    document.getElementById("quickPlanner");

if (quickPlanner) {

    quickPlanner.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/planner.html";
        }
    );
}


/* ================= POMODORO DATA ================= */

function updatePomodoroDashboard() {

    const sessions =
        getPomodoroSessions();


    const pomodoroElement =
        document.getElementById("pomodoroSessions");


    if (pomodoroElement) {
        pomodoroElement.textContent = sessions;
    }
}


/* ================= DYNAMIC GREETING ================= */

function updateGreeting() {

    const greeting =
        document.getElementById("greeting");

    if (!greeting) {
        return;
    }


    const hour = new Date().getHours();

    let message;


    if (hour < 12) {

        message = "Good Morning";

    } else if (hour < 17) {

        message = "Good Afternoon";

    } else if (hour < 21) {

        message = "Good Evening";

    } else {

        message = "Good Night";
    }


    greeting.textContent =
        `${message}, Sanjiv Kumar 👋`;
}


/* ================= DARK MODE ================= */

function updateThemeButton() {

    const themeBtn =
        document.getElementById("themeBtn");

    if (!themeBtn) {
        return;
    }


    const theme =
        localStorage.getItem(THEME_KEY);


    if (theme === "dark") {

        themeBtn.textContent =
            "☀️ Light Mode";

    } else {

        themeBtn.textContent =
            "🌙 Dark Mode";
    }
}


function applyTheme() {

    const theme =
        localStorage.getItem(THEME_KEY);


    if (theme === "dark") {

        document.body.classList.add("dark-mode");

    } else {

        document.body.classList.remove("dark-mode");
    }


    updateThemeButton();
}


const themeBtn =
    document.getElementById("themeBtn");

if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        function () {

            const currentTheme =
                localStorage.getItem(THEME_KEY);


            const newTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";


            localStorage.setItem(
                THEME_KEY,
                newTheme
            );


            applyTheme();
        }
    );
}


/* ================= AUTO REFRESH ================= */

window.addEventListener(
    "storage",
    function () {

        updateDashboard();
        displayTasks();
        displaySchedule();
        displayRecentNotes();
        updatePomodoroDashboard();

    }
);


/* ================= INITIALIZE ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        applyTheme();

        updateGreeting();

        updateDashboard();

        displayTasks();

        displaySchedule();

        displayRecentNotes();

        updatePomodoroDashboard();

    }
);