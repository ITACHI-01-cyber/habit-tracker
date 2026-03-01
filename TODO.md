# Habit Tracker 
## Project Structure
```
/home/vivek/Desktop/habit-tracker/
├── backend/
│   ├── app.py              # Flask server
│   └── data/
│       └── habits.json     # JSON storage
├── frontend/
│   ├── index.html          # Main HTML
│   ├── style.css           # Styling
│   └── main.js             # JavaScript logic
└── TODO.md                 # Task tracking
```

## How to Run
1. Navigate to backend directory: `cd /home/vivek/Desktop/habit-tracker/backend`
2. Run the Flask server: `python app.py`
3. Open browser: `http://localhost:5000`

## Features Implemented
- ✅ Task × Days grid table with Streak and % columns
- ✅ Cell states: Empty → Done (✔) → Miss (✖) → Empty
- ✅ Monthly streak heatmap visualization
- ✅ Python Flask backend with JSON storage
- ✅ LocalStorage for offline use
- ✅ Responsive design (table on desktop, stacked cards on mobile)
- ✅ Toast notifications with UNDO
- ✅ Category filtering (All, Study, Fitness, Health, Personal)
- ✅ Weekly stats (total completed, best streak, success rate)
- ✅ Motivational messages based on streak
- ✅ Positive/Negative habit types with icons
- ✅ Week navigation (Prev/Next)
- ✅ Delete habit functionality

