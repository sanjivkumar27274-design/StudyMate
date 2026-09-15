// =====================================
// StudyMate - Notes JavaScript
// =====================================


// =====================================
// GET ELEMENTS
// =====================================

const noteForm = document.getElementById("noteForm");

const noteTitle = document.getElementById("noteTitle");

const noteSubject = document.getElementById("noteSubject");

const noteContent = document.getElementById("noteContent");

const notesList = document.getElementById("notesList");

const searchNotes = document.getElementById("searchNotes");

const themeBtn = document.getElementById("themeBtn");

const totalNotes = document.getElementById("totalNotes");

const totalSubjects = document.getElementById("totalSubjects");

const latestNote = document.getElementById("latestNote");

const noteFormTitle = document.getElementById("noteFormTitle");

const noteFormDescription =
    document.getElementById("noteFormDescription");

const noteSubmitBtn =
    document.getElementById("noteSubmitBtn");

const noteCancelBtn =
    document.getElementById("noteCancelBtn");


// =====================================
// GET SAVED NOTES
// =====================================

let notes =
    JSON.parse(localStorage.getItem("studyMateNotes")) || [];


// Current editing note
let editingNoteId = null;


// =====================================
// SAVE NOTES
// =====================================

function saveNotes() {

    localStorage.setItem(
        "studyMateNotes",
        JSON.stringify(notes)
    );

}


// =====================================
// ADD / UPDATE NOTE
// =====================================

noteForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title =
        noteTitle.value.trim();

    const subject =
        noteSubject.value.trim();

    const content =
        noteContent.value.trim();


    if (
        title === "" ||
        subject === "" ||
        content === ""
    ) {

        alert("Please fill all fields.");

        return;

    }


    // =================================
    // UPDATE EXISTING NOTE
    // =================================

    if (editingNoteId !== null) {

        const note =
            notes.find(function(item) {

                return item.id === editingNoteId;

            });


        if (note) {

            note.title = title;

            note.subject = subject;

            note.content = content;

            note.updatedAt =
                new Date().toISOString();

        }


        saveNotes();

        displayNotes(searchNotes.value);

        updateStatistics();

        resetNoteForm();

        alert("Note updated successfully! ✏️");

        return;

    }


    // =================================
    // CREATE NEW NOTE
    // =================================

    const note = {

        id: Date.now(),

        title: title,

        subject: subject,

        content: content,

        createdAt:
            new Date().toISOString()

    };


    notes.unshift(note);


    saveNotes();

    displayNotes(searchNotes.value);

    updateStatistics();

    resetNoteForm();


    alert("Note saved successfully! 📝");

});


// =====================================
// DISPLAY NOTES
// =====================================

function displayNotes(searchText = "") {

    notesList.innerHTML = "";


    const search =
        searchText.toLowerCase().trim();


    const filteredNotes =
        notes.filter(function(note) {

            return (

                String(note.title || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(note.subject || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(note.content || "")
                    .toLowerCase()
                    .includes(search)

            );

        });


    // =================================
    // NO NOTES
    // =================================

    if (filteredNotes.length === 0) {

        notesList.innerHTML = `

            <div class="notes-empty">

                <div>📝</div>

                <h3>No notes found</h3>

                <p>
                    ${
                        search
                            ? "Try a different search."
                            : "Create a new note to get started."
                    }
                </p>

            </div>

        `;

        return;

    }


    // =================================
    // DISPLAY NOTES
    // =================================

    filteredNotes.forEach(function(note) {

        const noteElement =
            document.createElement("div");


        noteElement.className =
            "note-item";


        const noteDate =
            formatNoteDate(
                note.updatedAt || note.createdAt
            );


        noteElement.innerHTML = `

            <div class="note-item-header">

                <div>

                    <h3>
                        ${escapeHTML(note.title)}
                    </h3>

                    <span class="note-subject">
                        ${escapeHTML(note.subject)}
                    </span>

                </div>

                <small class="note-date">
                    ${noteDate}
                </small>

            </div>


            <p class="note-content">
                ${escapeHTML(note.content)}
            </p>


            <div class="note-actions">

                <button
                    class="edit-note"
                    onclick="editNote(${note.id})"
                >
                    ✏️ Edit
                </button>


                <button
                    class="delete-note"
                    onclick="deleteNote(${note.id})"
                >
                    🗑️ Delete
                </button>

            </div>

        `;


        notesList.appendChild(noteElement);

    });

}


// =====================================
// EDIT NOTE
// =====================================

function editNote(id) {

    const note =
        notes.find(function(item) {

            return item.id === id;

        });


    if (!note) {
        return;
    }


    editingNoteId = id;


    noteTitle.value =
        note.title || "";

    noteSubject.value =
        note.subject || "";

    noteContent.value =
        note.content || "";


    noteFormTitle.textContent =
        "Edit Note ✏️";


    noteFormDescription.textContent =
        "Update your study note";


    noteSubmitBtn.textContent =
        "💾 Update Note";


    noteCancelBtn.style.display =
        "inline-block";


    // Scroll to form
    noteForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// =====================================
// CANCEL EDIT
// =====================================

function resetNoteForm() {

    editingNoteId = null;

    noteForm.reset();


    noteFormTitle.textContent =
        "Create New Note";


    noteFormDescription.textContent =
        "Save important study information";


    noteSubmitBtn.textContent =
        "+ Save Note";


    noteCancelBtn.style.display =
        "none";

}


noteCancelBtn.addEventListener(
    "click",
    function() {

        resetNoteForm();

    }
);


// =====================================
// DELETE NOTE
// =====================================

function deleteNote(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this note?");


    if (!confirmDelete) {
        return;
    }


    notes =
        notes.filter(function(note) {

            return note.id !== id;

        });


    // If deleting currently edited note
    if (editingNoteId === id) {

        resetNoteForm();

    }


    saveNotes();

    displayNotes(searchNotes.value);

    updateStatistics();

}


// =====================================
// SEARCH NOTES
// =====================================

searchNotes.addEventListener(
    "input",
    function() {

        displayNotes(this.value);

    }
);


// =====================================
// NOTE STATISTICS
// =====================================

function updateStatistics() {

    // Total notes
    totalNotes.textContent =
        notes.length;


    // Unique subjects
    const subjects =
        new Set();


    notes.forEach(function(note) {

        if (note.subject) {

            subjects.add(
                note.subject.trim().toLowerCase()
            );

        }

    });


    totalSubjects.textContent =
        subjects.size;


    // Latest note
    if (notes.length === 0) {

        latestNote.textContent =
            "-";

        return;

    }


    const latest =
        notes[0];


    const latestTitle =
        latest.title || "Note";


    latestNote.textContent =
        latestTitle.length > 18
            ? latestTitle.substring(0, 18) + "..."
            : latestTitle;

}


// =====================================
// FORMAT NOTE DATE
// =====================================

function formatNoteDate(dateValue) {

    if (!dateValue) {
        return "";
    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return dateValue;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
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
        text || "";


    return div.innerHTML;

}


// =====================================
// DARK MODE
// =====================================

function loadTheme() {

    const theme =
        localStorage.getItem("studyMateTheme");


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
// INITIAL LOAD
// =====================================

loadTheme();

displayNotes();

updateStatistics();