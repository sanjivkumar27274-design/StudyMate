// =====================================
// StudyMate - Task Management
// =====================================


// =====================================
// GET ELEMENTS
// =====================================

const taskForm =
    document.getElementById("taskForm");

const taskTitle =
    document.getElementById("taskTitle");

const taskPriority =
    document.getElementById("taskPriority");

const taskDate =
    document.getElementById("taskDate");

const taskList =
    document.getElementById("taskList");

const taskFilter =
    document.getElementById("taskFilter");

const dateFilter =
    document.getElementById("dateFilter");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const themeBtn =
    document.getElementById("themeBtn");


// =====================================
// GET TASKS FROM LOCAL STORAGE
// =====================================

let tasks =
    JSON.parse(
        localStorage.getItem("studyMateTasks")
    ) || [];


// =====================================
// SAVE TASKS
// =====================================

function saveTasks() {

    localStorage.setItem(
        "studyMateTasks",
        JSON.stringify(tasks)
    );

}


// =====================================
// ADD TASK
// =====================================

taskForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            taskTitle.value.trim();

        const priority =
            taskPriority.value;

        const date =
            taskDate.value;


        if (!title || !date) {

            alert(
                "Please fill all fields."
            );

            return;

        }


        const newTask = {

            id: Date.now(),

            title: title,

            priority: priority,

            date: date,

            completed: false

        };


        tasks.push(newTask);


        saveTasks();

        displayTasks();

        updateStats();


        taskForm.reset();

    }
);


// =====================================
// GET TASK STATUS
// =====================================

function getTaskStatus(task) {

    if (task.completed) {

        return {
            text: "Completed",
            className: "completed"
        };

    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    if (task.date < today) {

        return {
            text: "Overdue",
            className: "overdue"
        };

    }


    if (task.date === today) {

        return {
            text: "Today",
            className: "today"
        };

    }


    return {
        text: "Upcoming",
        className: "upcoming"
    };

}


// =====================================
// DISPLAY TASKS
// =====================================

function displayTasks() {

    taskList.innerHTML = "";


    const statusFilter =
        taskFilter.value;

    const selectedDateFilter =
        dateFilter
            ? dateFilter.value
            : "all";


    let filteredTasks =
        [...tasks];


    // =================================
    // STATUS FILTER
    // =================================

    if (statusFilter === "pending") {

        filteredTasks =
            filteredTasks.filter(
                function(task) {

                    return !task.completed;

                }
            );

    }


    if (statusFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                function(task) {

                    return task.completed;

                }
            );

    }


    // =================================
    // DATE FILTER
    // =================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    if (selectedDateFilter === "overdue") {

        filteredTasks =
            filteredTasks.filter(
                function(task) {

                    return (
                        !task.completed &&
                        task.date < today
                    );

                }
            );

    }


    if (selectedDateFilter === "today") {

        filteredTasks =
            filteredTasks.filter(
                function(task) {

                    return (
                        task.date === today
                    );

                }
            );

    }


    if (selectedDateFilter === "upcoming") {

        filteredTasks =
            filteredTasks.filter(
                function(task) {

                    return (
                        !task.completed &&
                        task.date > today
                    );

                }
            );

    }


    // =================================
    // NO TASKS
    // =================================

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `

            <div class="no-task">

                <h3>
                    📋 No tasks found
                </h3>

                <p>
                    No tasks match the selected filter.
                </p>

            </div>

        `;

        return;

    }


    // =================================
    // SORT TASKS
    // =================================

    filteredTasks.sort(
        function(a, b) {

            // Completed tasks last

            if (
                a.completed !==
                b.completed
            ) {

                return a.completed
                    ? 1
                    : -1;

            }


            // Earlier dates first

            return a.date.localeCompare(
                b.date
            );

        }
    );


    // =================================
    // DISPLAY
    // =================================

    filteredTasks.forEach(
        function(task) {


            const taskElement =
                document.createElement("div");


            taskElement.className =
                "management-task";


            const status =
                getTaskStatus(task);


            taskElement.innerHTML = `

                <!-- CHECKBOX -->

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >


                <!-- TASK INFORMATION -->

                <div class="management-task-info">

                    <h3 class="${
                        task.completed
                            ? "completed-management-task"
                            : ""
                    }">

                        ${escapeHTML(
                            task.title
                        )}

                    </h3>


                    <p>

                        📅
                        ${formatDate(task.date)}

                    </p>

                </div>


                <!-- PRIORITY -->

                <span
                    class="
                        management-priority
                        ${(
                            task.priority ||
                            "Medium"
                        ).toLowerCase()}
                    "
                >

                    ${escapeHTML(
                        task.priority ||
                        "Medium"
                    )}

                </span>


                <!-- STATUS -->

                <span
                    class="
                        task-status
                        ${status.className}
                    "
                >

                    ${status.text}

                </span>


                <!-- DELETE -->

                <button
                    class="task-delete"
                    onclick="deleteTask(${task.id})"
                >

                    🗑️

                </button>

            `;


            taskList.appendChild(
                taskElement
            );

        }
    );

}


// =====================================
// COMPLETE / UNCOMPLETE TASK
// =====================================

function toggleTask(id) {

    const task =
        tasks.find(
            function(task) {

                return task.id === id;

            }
        );


    if (task) {

        task.completed =
            !task.completed;

    }


    saveTasks();

    displayTasks();

    updateStats();

}


// =====================================
// DELETE TASK
// =====================================

function deleteTask(id) {

    if (
        !confirm(
            "Delete this task?"
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            function(task) {

                return task.id !== id;

            }
        );


    saveTasks();

    displayTasks();

    updateStats();

}


// =====================================
// UPDATE STATISTICS
// =====================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;

}


// =====================================
// STATUS FILTER
// =====================================

taskFilter.addEventListener(
    "change",
    function() {

        displayTasks();

    }
);


// =====================================
// DATE FILTER
// =====================================

if (dateFilter) {

    dateFilter.addEventListener(
        "change",
        function() {

            displayTasks();

        }
    );

}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }
    );

}


// =====================================
// SECURITY
// =====================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


// =====================================
// DARK MODE
// =====================================

function loadTheme() {

    const theme =
        localStorage.getItem(
            "studyMateTheme"
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );


        if (themeBtn) {

            themeBtn.textContent =
                "☀️ Light Mode";

        }

    } else {

        if (themeBtn) {

            themeBtn.textContent =
                "🌙 Dark Mode";

        }

    }

}


// =====================================
// DARK MODE BUTTON
// =====================================

if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        function() {

            document.body.classList.toggle(
                "dark"
            );


            if (
                document.body.classList.contains(
                    "dark"
                )
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

}


// =====================================
// SET TODAY AS DEFAULT DATE
// =====================================

if (taskDate) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    taskDate.min = today;

}


// =====================================
// INITIALIZE
// =====================================

loadTheme();

displayTasks();

updateStats();


console.log(
    "StudyMate Task Management Ready!"
);