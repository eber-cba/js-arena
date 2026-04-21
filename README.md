# JS Arena 🎮

A real-time multiplayer "hacker-themed" coding platform for students to practice JavaScript logic in a gamified environment.

## 🚀 Features

- **Real-time Multiplayer:** Track other players' progress and scores via Firebase.
- **Hacker Aesthetic:** Matrix-inspired UI with terminal effects and scanlines.
- **Mission-based Gameplay:** Complete coding challenges to climb the ranking.
- **Admin Dashboard:** Monitor all active students in real-time.

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/eber-cba/js-arena.git
   cd js-arena
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_DATABASE_URL=your_database_url
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

## 🏗️ Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Backend:** [Firebase Realtime Database](https://firebase.google.com/)
- **Styling:** Custom CSS with Glassmorphism and Neon effects
