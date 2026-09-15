[README.md](https://github.com/user-attachments/files/32238483/README.md)
# 📚 StudyMate -- Student Productivity & Study Management System

StudyMate is a web-based student productivity and study management
system designed to help students organize tasks, plan study sessions,
write notes, use a Pomodoro timer, and track study progress from one
dashboard.

## ✨ Features

### 🏠 Dashboard

-   Personalized greeting
-   Total, completed and pending task statistics
-   Task completion percentage
-   Today's tasks
-   Today's study schedule
-   Quick actions
-   Recent notes
-   Study progress visualization

### ✅ Task Management

-   Add, complete and delete tasks
-   Set task priority and date
-   Filter by all, pending or completed
-   Filter by overdue, today or upcoming
-   Automatic task status display

### 📅 Study Planner

-   Add study sessions
-   Set subject, date, time and duration
-   Edit and delete sessions
-   Total sessions
-   Total planned study time
-   Upcoming sessions
-   Past, today and upcoming status

### 📝 Notes

-   Create study notes
-   Add title, subject and content
-   Edit and delete notes
-   Search notes
-   Total notes and subject statistics
-   Latest note information
-   Recent notes on dashboard

### ⏱️ Pomodoro Timer

-   25-minute Focus session
-   5-minute Short Break
-   15-minute Long Break
-   Start, pause and reset
-   Progress bar
-   Pomodoro cycle tracking
-   Completed session tracking
-   Daily focus-time tracking
-   Automatic break switching

### 📊 Progress Tracking

-   Overall task completion
-   Task statistics
-   Pomodoro session count
-   Notes count
-   Study sessions
-   Planned study time
-   Productivity score
-   Task performance
-   Study insights
-   Productivity tips

### 🌙 Dark / Light Mode

-   Light and Dark Mode
-   Theme preference saved with LocalStorage
-   Theme shared across StudyMate pages

### 📱 Responsive Design

-   Desktop layout
-   Tablet layout
-   Mobile-friendly layout
-   Responsive cards, forms and controls

## 🛠️ Technologies Used

-   **HTML5** -- Structure
-   **CSS3** -- Styling, responsive design, dark mode and UI effects
-   **JavaScript (Vanilla JS)** -- Application logic and interactivity
-   **LocalStorage API** -- Browser-based persistent data
-   **CSS Grid & Flexbox** -- Layout

The current version does not require a backend or database.

## 📁 Project Structure

``` text
StudyMate/
│
├── index.html
├── style.css
├── script.js
│
└── pages/
    ├── tasks.html
    ├── tasks.css
    ├── tasks.js
    ├── planner.html
    ├── planner.css
    ├── planner.js
    ├── notes.html
    ├── notes.css
    ├── notes.js
    ├── pomodoro.html
    ├── pomodoro.css
    ├── pomodoro.js
    ├── progress.html
    ├── progress.css
    └── progress.js
```

## 💾 LocalStorage

StudyMate stores its current application data in the browser using
LocalStorage.

  Key                            Purpose
  ------------------------------ -----------------------------
  `studyMateTasks`               Tasks
  `studyMateSessions`            Study planner sessions
  `studyMateNotes`               Notes
  `studyMateCompletedSessions`   Completed Pomodoro sessions
  `studyMatePomodoroCycle`       Pomodoro cycle progress
  `studyMateTodayFocusMinutes`   Today's focus minutes
  `studyMateFocusDate`           Focus-date tracking
  `studyMateTheme`               Light/Dark Mode preference

Because data is stored locally, it belongs to the browser where the
project is being used.

## 🚀 How to Run

### Option 1 -- Browser

1.  Open the `StudyMate` folder.
2.  Double-click `index.html`.
3.  StudyMate will open in the browser.

### Option 2 -- VS Code + Live Server

1.  Open the `StudyMate` folder in Visual Studio Code.
2.  Open `index.html`.
3.  Start the project with a local development server such as Live
    Server.
4.  Open the local URL in your browser.

## 🧭 Application Modules

``` text
Dashboard
   │
   ├── Tasks
   ├── Study Planner
   ├── Notes
   ├── Pomodoro
   └── Progress
```

The dashboard connects the major modules through shared LocalStorage
data.

## 🔄 Dashboard Synchronization

-   **Tasks → Dashboard:** task statistics and today's tasks
-   **Planner → Dashboard:** today's study sessions
-   **Notes → Dashboard:** latest notes
-   **Pomodoro → Progress:** completed Pomodoro sessions
-   **Tasks + Planner + Notes + Pomodoro → Progress:** combined
    productivity view

## 🎯 Productivity Score

The Progress page provides a simple productivity indicator based on
available StudyMate activity, including:

-   Task completion
-   Pomodoro sessions
-   Planned study sessions
-   Notes created

It is intended as an application-level productivity indicator rather
than a scientific measurement.

## 🎨 UI Highlights

-   Dashboard-style interface
-   Sidebar navigation
-   Statistics cards
-   Progress circles
-   Status badges
-   Interactive buttons
-   Empty states
-   Hover effects
-   Light/Dark themes
-   Responsive layouts

## 🔐 Privacy

The current version does not require a backend account. Application data
is stored locally in the browser using LocalStorage.

Clearing the browser's site data may remove locally stored StudyMate
information.

## 🔮 Future Improvements

Possible future versions could include:

-   User authentication
-   Cloud database
-   Firebase integration
-   Multi-device synchronization
-   Calendar integration
-   Task reminders
-   Browser notifications
-   Weekly/monthly analytics
-   Study streaks
-   Detailed charts and reports
-   Import/export
-   Backend API
-   User profile management

## 🧪 Testing Checklist

### Dashboard

-   [ ] Task statistics update
-   [ ] Today's tasks display
-   [ ] Complete/delete task
-   [ ] Today's schedule displays
-   [ ] Recent notes display
-   [ ] Quick actions navigate correctly

### Tasks

-   [ ] Add task
-   [ ] Complete task
-   [ ] Delete task
-   [ ] Priority and date work
-   [ ] Task filters work
-   [ ] Date filters work

### Planner

-   [ ] Add session
-   [ ] Edit session
-   [ ] Delete session
-   [ ] Study-time calculation
-   [ ] Upcoming-session count

### Notes

-   [ ] Add note
-   [ ] Edit note
-   [ ] Delete note
-   [ ] Search
-   [ ] Statistics update

### Pomodoro

-   [ ] Start
-   [ ] Pause
-   [ ] Reset
-   [ ] Focus mode
-   [ ] Short Break
-   [ ] Long Break
-   [ ] Cycle tracking

### Progress

-   [ ] Task progress
-   [ ] Pomodoro sessions
-   [ ] Study sessions
-   [ ] Notes count
-   [ ] Productivity score

### Theme

-   [ ] Light Mode
-   [ ] Dark Mode
-   [ ] Theme persists across pages

## 👨‍💻 Developer

**Created by Sanjiv Kumar**

StudyMate was developed as a student productivity and study management
web project using HTML, CSS and JavaScript.

## 📄 License

This project is intended for educational, learning and
internship/project demonstration purposes.

## ⭐ Conclusion

StudyMate brings tasks, study planning, notes, focused study sessions
and progress tracking into one simple application.

**StudyMate -- Plan. Focus. Learn. Progress. 📚**
