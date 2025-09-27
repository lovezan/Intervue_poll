# Live Polling System

A lightweight, real-time classroom polling app using Next.js (App Router) and Server-Sent Events (SSE). Includes a live Chat + Participants panel with “Kick out” actions for teachers.

## Features
- Teacher can ask timed multiple-choice questions with live aggregated results.
- Students answer on their devices; results update in real-time.
- Integrated floating Chat panel with Participants tab (teachers can kick students).
- Minimal “connected” state for students instead of a blocking “waiting” screen.

## Run locally

1. Install dependencies:
   - If you downloaded the ZIP exported from v0: open the project in your editor and run:
     - `npm install`
     - `npm run dev`
   - Default dev server: http://localhost:3000

2. Open pages:
   - Student: http://localhost:3000/student
   - Teacher: http://localhost:3000/teacher

3. Use the app:
   - Teacher page: enter a question, set duration, add options, click “Ask Question”.
   - Student page: enter a name to join. When a question is asked, select an option and submit.
   - Chat: click the round button at bottom-right to open Chat/Participants panel.
     - Teachers can kick students from the Participants tab.

Notes:
- This demo uses an in-memory store. Restarting the dev server clears all data.
- For multi-room or persistence (Postgres/Redis), ask and we’ll add it.

## Customization tips

- To change the brand color, search for `brand.purple` in the code.
- To further minimize the student “waiting” state, adjust the block under `if (!cq)` in `app/student/page.tsx`.
