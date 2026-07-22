# StudyMate AI 🎓✨

**StudyMate AI** is a complete, modern, AI-powered study companion and academic productivity web application. Powered by React, Tailwind CSS, and Google Gemini 3.6 Flash AI, it empowers students to organize study tasks, track homework assignments, manage weekly timetables, analyze study progress with charts, and learn smarter with an instant AI tutor.
live public URL 
https://studymate-ruddy.vercel.app
---
## How to Run

1. Clone the repository.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.
   ## Tools Used

- Google AI Studio
- Google Gemini AI
- React
- Next.js
- Tailwind CSS
- GitHub
- Vercel
  ## Screenshots

### Dashboard
![Dashboard](images/dashboard.png)

### AI Assistant
![AI Assistant](images/ai-assistant.png)

### Task Manager
![Task Manager](images/tasks.png)


## 🌟 Key Features

- **📊 Dashboard & Overview**: Welcome header with motivational quote, quick statistics (pending tasks, homework due, total study time, current streak), and Pomodoro timer launcher.
- **🔐 User Authentication**: Email and password authentication with profile persistence, guest demo login option, and user data management.
- **✅ Study Tasks Manager**: Add, edit, delete, and filter study tasks by status, subject, and priority (`High`, `Medium`, `Low`).
- **📚 Homework Tracker**: Track assignments with status pipelines (`Not Started`, `In Progress`, `Completed`, `Submitted`), grade history, countdown timers, and **Get AI Solution** integration.
- **📅 Interactive Study Timetable**: Weekly schedule calendar grid with subject color-coding and an **AI Smart Schedule Generator** for exam preparation.
- **📈 Progress Dashboard & Analytics**: Visual charts powered by Recharts (Weekly Study Hours Bar Chart, Subject Time Distribution Pie Chart), study streaks, and unlockable achievement badges.
- **🤖 Gemini AI Study Assistant Suite**:
  - **Ask AI Tutor**: Interactive Q&A chat for step-by-step explanations across Math, Science, Coding, Literature, and History.
  - **Note Summarizer**: Paste lecture notes or textbook excerpts to extract bulleted key takeaways.
  - **AI Flashcard Deck Creator**: Instantly generate flashcard decks from any topic or text passage.
  - **Step-by-Step Homework Solver**: Detailed concept explanations and solutions for complex questions.
  - **AI Exam Timetable Planner**: Tailored study schedule generator based on remaining days and daily goals.
- **🎴 Interactive Flashcard Player**: Active recall practice with 3D flip card animations, progress tracking, and deck creation.
- **⏱️ Focus Pomodoro Timer**: Preset timer blocks (25m Focus / 5m Short Break / 15m Long Break) with sound chime alerts and automatic minute logging into progress stats.
- **🌓 Dark & Light Mode**: Seamless dark and light visual themes with preference saving.
- **💾 Local Storage Persistence**: Zero required backend server setup—all user data, tasks, homework, and study logs automatically save to browser `localStorage`. Includes JSON Data Export & Import tools.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/studymate-ai.git
   cd studymate-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Build & Deployment

### Production Build

To build the full-stack bundle with Express server and Vite frontend:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

### Vercel Deployment

This project is configured with `vercel.json` for deployment on Vercel:

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the Environment Variable `GEMINI_API_KEY` in Vercel Project Settings > Environment Variables.
4. Click **Deploy**. Vercel will automatically run `npm run build` and host the application.

---

## 📁 Project Architecture

```
├── .env.example            # Environment variables documentation
├── index.html              # Primary HTML entry point
├── metadata.json           # Applet metadata configuration
├── package.json            # Scripts & dependencies
├── server.ts               # Express full-stack backend with Gemini 3.6 Flash routes
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment setup
├── vite.config.ts          # Vite build plugin settings
└── src/
    ├── App.tsx             # Root React component and main state controller
    ├── main.tsx            # React DOM mounting
    ├── index.css           # Global Tailwind CSS import
    ├── types.ts            # TypeScript interfaces & enums
    ├── utils/
    │   ├── aiService.ts    # Gemini API client wrapper & smart fallbacks
    │   └── storage.ts      # LocalStorage persistence manager & seed data
    └── components/
        ├── AIAssistantView.tsx # Gemini AI Study Hub
        ├── AuthModal.tsx       # User Login & Sign-up Modal
        ├── DashboardView.tsx   # Dashboard Welcome & Stats Overview
        ├── FlashcardsView.tsx  # Interactive Flip Flashcards
        ├── HomeworkView.tsx    # Homework Tracker & AI Solver
        ├── Navbar.tsx          # Navigation Header Bar
        ├── PomodoroTimer.tsx   # Focus Pomodoro Timer
        ├── ProfileModal.tsx    # Profile Settings & Backup Export
        ├── ProgressView.tsx   # Progress Analytics & Recharts
        ├── Sidebar.tsx        # Navigation Menu
        └── TasksView.tsx       # Study Tasks Management
```

---

## 📜 License

Apache-2.0 License. Built for students worldwide!
