// =====================================
// StudyMate - Study Planner JavaScript
// =====================================


// =====================================
// GET ELEMENTS
// =====================================

const plannerForm =
    document.getElementById("plannerForm");

const subjectInput =
    document.getElementById("subject");

const dateInput =
    document.getElementById("studyDate");

const timeInput =
    document.getElementById("studyTime");

const durationInput =
    document.getElementById("duration");

const plannerList =
    document.getElementById("plannerList");

const themeBtn =
    document.getElementById("themeBtn");

const totalSessions =
    document.getElementById("totalSessions");

const totalStudyTime =
    document.getElementById("totalStudyTime");

const upcomingSessions =
    document.getElementById("upcomingSessions");

const plannerFormTitle =
    document.getElementById("plannerFormTitle");

const plannerSubmitBtn =
    document.getElementById("plannerSubmitBtn");

const plannerCancelBtn =
    document.getElementById("plannerCancelBtn");


// =====================================
// GET SAVED SESSIONS
// =====================================

let studySessions =
    JSON.parse(
        localStorage.getItem("studyMateSessions")
    ) || [];


// =====================================
// EDIT SESSION ID
// =====================================

let editingSessionId = null;


// =====================================
// SAVE SESSIONS
// =====================================

function saveSessions() {

    localStorage.setItem(
        "studyMateSessions",
        JSON.stringify(studySessions)
    );

}


// =====================================
// ADD / EDIT SESSION
// =====================================

plannerForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const subject =
            subjectInput.value.trim();

        const date =
            dateInput.value;

        const time =
            timeInput.value;

        const duration =
            durationInput.value;


        // =============================
        // VALIDATION
        // =============================

        if (
            subject === "" ||
            date === "" ||
            time === "" ||
            duration === ""
        ) {

            alert(
                "Please fill all fields."
            );

            return;

        }


        // =============================
        // EDIT EXISTING SESSION
        // =============================

        if (editingSessionId !== null) {

            const session =
                studySessions.find(
                    function(session) {

                        return (
                            session.id ===
                            editingSessionId
                        );

                    }
                );


            if (session) {

                session.subject =
                    subject;

                session.date =
                    date;

                session.time =
                    time;

                session.duration =
                    duration;

            }


            saveSessions();

            displaySessions();

            updateStatistics();

            resetForm();

            alert(
                "Study session updated successfully! ✅"
            );

            return;

        }


        // =============================
        // CREATE NEW SESSION
        // =============================

        const newSession = {

            id: Date.now(),

            subject: subject,

            date: date,

            time: time,

            duration: duration

        };


        studySessions.push(
            newSession
        );


        saveSessions();

        displaySessions();

        updateStatistics();


        resetForm();


        alert(
            "Study session added successfully! ✅"
        );

    }
);


// =====================================
// DISPLAY SESSIONS
// =====================================

function displaySessions() {

    plannerList.innerHTML = "";


    // =============================
    // EMPTY STATE
    // =============================

    if (studySessions.length === 0) {

        plannerList.innerHTML = `

            <div class="planner-empty">

                <div>
                    📅
                </div>

                <h3>
                    No study sessions
                </h3>

                <p>
                    Add your first study session.
                </p>

            </div>

        `;

        return;

    }


    // =============================
    // SORT BY DATE & TIME
    // =============================

    const sortedSessions =
        [...studySessions].sort(
            function(a, b) {

                const dateA =
                    new Date(
                        `${a.date}T${a.time}`
                    );

                const dateB =
                    new Date(
                        `${b.date}T${b.time}`
                    );

                return dateA - dateB;

            }
        );


    // =============================
    // DISPLAY
    // =============================

    sortedSessions.forEach(
        function(session) {

            const sessionElement =
                document.createElement("div");


            sessionElement.className =
                "planner-session";


            const sessionStatus =
                getSessionStatus(session);


            sessionElement.innerHTML = `

                <!-- TIME -->

                <div class="session-time">

                    ${formatTime(
                        session.time
                    )}

                </div>


                <!-- INFORMATION -->

                <div class="session-info">

                    <h3>

                        ${escapeHTML(
                            session.subject
                        )}

                    </h3>


                    <p>

                        📅
                        ${formatDate(
                            session.date
                        )}

                    </p>

                </div>


                <!-- DURATION -->

                <span
                    class="session-duration">

                    ${escapeHTML(
                        session.duration
                    )}

                </span>


                <!-- STATUS -->

                <span
                    class="
                        session-status
                        ${sessionStatus.className}
                    ">

                    ${sessionStatus.text}

                </span>


                <!-- EDIT -->

                <button
                    class="session-edit"
                    onclick="editSession(${session.id})"
                    title="Edit session">

                    ✏️

                </button>


                <!-- DELETE -->

                <button
                    class="session-delete"
                    onclick="deleteSession(${session.id})"
                    title="Delete session">

                    🗑️

                </button>

            `;


            plannerList.appendChild(
                sessionElement
            );

        }
    );

}


// =====================================
// SESSION STATUS
// =====================================

function getSessionStatus(session) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    if (session.date < today) {

        return {

            text: "Past",

            className: "past"

        };

    }


    if (session.date === today) {

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
// EDIT SESSION
// =====================================

function editSession(id) {

    const session =
        studySessions.find(
            function(session) {

                return session.id === id;

            }
        );


    if (!session) {
        return;
    }


    editingSessionId =
        id;


    // Fill form

    subjectInput.value =
        session.subject;

    dateInput.value =
        session.date;

    timeInput.value =
        session.time;

    durationInput.value =
        session.duration;


    // Change heading

    if (plannerFormTitle) {

        plannerFormTitle.textContent =
            "Edit Study Session";

    }


    // Change button

    if (plannerSubmitBtn) {

        plannerSubmitBtn.textContent =
            "💾 Update Study Session";

    }


    // Show cancel

    if (plannerCancelBtn) {

        plannerCancelBtn.style.display =
            "block";

    }


    // Scroll to form

    plannerForm.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// =====================================
// CANCEL EDIT
// =====================================

function cancelEdit() {

    editingSessionId =
        null;


    plannerForm.reset();


    if (plannerFormTitle) {

        plannerFormTitle.textContent =
            "Add Study Session";

    }


    if (plannerSubmitBtn) {

        plannerSubmitBtn.textContent =
            "+ Add Study Session";

    }


    if (plannerCancelBtn) {

        plannerCancelBtn.style.display =
            "none";

    }

}


// =====================================
// RESET FORM
// =====================================

function resetForm() {

    editingSessionId =
        null;


    plannerForm.reset();


    if (plannerFormTitle) {

        plannerFormTitle.textContent =
            "Add Study Session";

    }


    if (plannerSubmitBtn) {

        plannerSubmitBtn.textContent =
            "+ Add Study Session";

    }


    if (plannerCancelBtn) {

        plannerCancelBtn.style.display =
            "none";

    }

}


// =====================================
// CANCEL BUTTON
// =====================================

if (plannerCancelBtn) {

    plannerCancelBtn.addEventListener(
        "click",
        function() {

            cancelEdit();

        }
    );

}


// =====================================
// DELETE SESSION
// =====================================

function deleteSession(id) {

    const confirmDelete =
        confirm(
            "Delete this study session?"
        );


    if (!confirmDelete) {

        return;

    }


    studySessions =
        studySessions.filter(
            function(session) {

                return session.id !== id;

            }
        );


    saveSessions();

    displaySessions();

    updateStatistics();


    // Cancel edit if deleted session
    // was currently being edited

    if (editingSessionId === id) {

        resetForm();

    }

}


// =====================================
// UPDATE STATISTICS
// =====================================

function updateStatistics() {

    // Total sessions

    if (totalSessions) {

        totalSessions.textContent =
            studySessions.length;

    }


    // Total study time

    let totalMinutes = 0;


    studySessions.forEach(
        function(session) {

            totalMinutes +=
                durationToMinutes(
                    session.duration
                );

        }
    );


    if (totalStudyTime) {

        totalStudyTime.textContent =
            formatStudyTime(
                totalMinutes
            );

    }


    // Upcoming sessions

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const upcoming =
        studySessions.filter(
            function(session) {

                return session.date >= today;

            }
        ).length;


    if (upcomingSessions) {

        upcomingSessions.textContent =
            upcoming;

    }

}


// =====================================
// CONVERT DURATION TO MINUTES
// =====================================

function durationToMinutes(
    duration
) {

    if (!duration) {

        return 0;

    }


    if (
        duration ===
        "30 minutes"
    ) {

        return 30;

    }


    if (
        duration ===
        "1 hour"
    ) {

        return 60;

    }


    if (
        duration ===
        "1.5 hours"
    ) {

        return 90;

    }


    if (
        duration ===
        "2 hours"
    ) {

        return 120;

    }


    if (
        duration ===
        "3 hours"
    ) {

        return 180;

    }


    return 0;

}


// =====================================
// FORMAT STUDY TIME
// =====================================

function formatStudyTime(minutes) {

    const hours =
        Math.floor(
            minutes / 60
        );


    const remainingMinutes =
        minutes % 60;


    if (hours === 0) {

        return `${remainingMinutes}m`;

    }


    if (remainingMinutes === 0) {

        return `${hours}h`;

    }


    return `${hours}h ${remainingMinutes}m`;

}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(dateString) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
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
// FORMAT TIME
// =====================================

function formatTime(timeString) {

    const [hours, minutes] =
        timeString.split(":");


    const date =
        new Date();


    date.setHours(
        Number(hours)
    );

    date.setMinutes(
        Number(minutes)
    );


    return date.toLocaleTimeString(
        "en-IN",
        {

            hour: "numeric",

            minute: "2-digit",

            hour12: true

        }
    );

}


// =====================================
// SECURITY
// =====================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// =====================================
// DARK MODE
// =====================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "studyMateTheme"
        );


    if (
        savedTheme ===
        "dark"
    ) {

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
// SET MINIMUM DATE
// =====================================

if (dateInput) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    dateInput.min =
        today;

}


// =====================================
// INITIALIZE
// =====================================

loadTheme();

displaySessions();

updateStatistics();


console.log(
    "StudyMate Study Planner Ready!"
);