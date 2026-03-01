/**
 * Habit Tracker - Main JavaScript
 * Handles all frontend logic, rendering, and backend communication
 */

// ==================== Configuration ====================
const API_BASE = ''; // Empty for same-origin, or 'http://localhost:5000' for separate backend
const STATES = ['empty', 'done', 'miss'];
const STATE_SYMBOLS = {
    empty: '',
    done: '✔',
    miss: '✖'
};
const MOTIVATION_MESSAGES = {
    1: "Great start! Keep the momentum going! 🚀",
    3: "3-day streak! You're building a habit! 💪",
    7: "One week complete! Consistency is key! ⭐",
    14: "Two weeks strong! You're unstoppable! 🔥",
    21: "3-week streak! Amazing dedication! 🎉",
    30: "One month! You're a habit master! 👑"
};

// ==================== State Management ====================
let habits = [];
let currentWeekOffset = 0;
let currentView = 'week';
let currentCategory = 'all';
let undoStack = [];

// ==================== Utility Functions ====================

/**
 * Get the dates for the current week (Monday to Sunday)
 */
function getWeekDates(offset = 0) {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    
    // Adjust to get Monday of the current week
    const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    monday.setDate(today.getDate() + daysToMonday + (offset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date);
    }
    return dates;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Format date for display
 */
function formatDisplayDate(date) {
    return `${date.getDate()}`;
}

/**
 * Check if date is today
 */
function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

/**
 * Generate unique ID
 */
function generateId() {
    return 'habit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Calculate streak for a habit
 */
function calculateStreak(habit) {
    const entries = habit.entries || {};
    const dates = Object.keys(entries).sort().reverse();
    
    if (dates.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    // Check from today backwards
    for (let i = 0; i < dates.length; i++) {
        const entryDate = new Date(dates[i]);
        const checkDate = new Date(currentDate);
        checkDate.setDate(checkDate.getDate() - i);
        
        const dateStr = formatDate(checkDate);
        
        if (entries[dateStr] === 'done') {
            streak++;
        } else if (entries[dateStr] === 'miss') {
            break;
        }
    }
    
    return streak;
}

/**
 * Calculate completion percentage for a habit in current week
 */
function calculatePercentage(habit, weekDates) {
    const entries = habit.entries || {};
    let completed = 0;
    let total = 0;
    
    weekDates.forEach(date => {
        const dateStr = formatDate(date);
        if (entries[dateStr]) {
            total++;
            if (entries[dateStr] === 'done') {
                completed++;
            }
        }
    });
    
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
}

// ==================== API Functions ====================

/**
 * Load habits from backend
 */
async function loadHabits() {
    try {
        const response = await fetch(`${API_BASE}/data`);
        if (response.ok) {
            habits = await response.json();
            saveToLocalStorage();
        }
    } catch (error) {
        console.log('Backend not available, using localStorage');
        loadFromLocalStorage();
    }
}

/**
 * Save habits to backend
 */
async function saveHabits() {
    try {
        await fetch(`${API_BASE}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habits)
        });
    } catch (error) {
        console.log('Backend not available, saved to localStorage only');
    }
    saveToLocalStorage();
}

// ==================== LocalStorage Functions ====================

/**
 * Save to localStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

/**
 * Load from localStorage
 */
function loadFromLocalStorage() {
    const stored = localStorage.getItem('habits');
    if (stored) {
        habits = JSON.parse(stored);
    }
}

// ==================== Rendering Functions ====================

/**
 * Render the week navigation display
 */
function renderWeekDisplay() {
    const weekDates = getWeekDates(currentWeekOffset);
    const startDate = weekDates[0];
    const endDate = weekDates[6];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let displayText;
    if (startDate.getMonth() === endDate.getMonth()) {
        displayText = `${months[startDate.getMonth()]} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
    } else {
        displayText = `${months[startDate.getMonth()]} ${startDate.getDate()} - ${months[endDate.getMonth()]} ${endDate.getDate()}`;
    }
    
    document.getElementById('currentWeekDisplay').textContent = displayText;
}

/**
 * Render day headers in the table
 */
function renderDayHeaders() {
    const weekDates = getWeekDates(currentWeekOffset);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    weekDates.forEach((date, index) => {
        const dayEl = document.getElementById(`day-${index}`);
        if (dayEl) {
            dayEl.textContent = formatDisplayDate(date);
        }
    });
}

/**
 * Render the habit table
 */
function renderTable() {
    const tbody = document.getElementById('habitTableBody');
    const weekDates = getWeekDates(currentWeekOffset);
    
    // Filter habits by category
    let filteredHabits = habits;
    if (currentCategory !== 'all') {
        filteredHabits = habits.filter(h => h.category === currentCategory);
    }
    
    if (filteredHabits.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>No habits yet</h3>
                    <p>Click "Add Habit" to create your first habit</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredHabits.map(habit => {
        const streak = calculateStreak(habit);
        const percentage = calculatePercentage(habit, weekDates);
        
        const typeIcon = habit.type === 'positive' ? '↑' : '↓';
        const typeClass = habit.type === 'positive' ? 'positive' : 'negative';
        
        let cells = weekDates.map((date, index) => {
            const dateStr = formatDate(date);
            const state = habit.entries?.[dateStr] || 'empty';
            const isTodayClass = isToday(date) ? 'today' : '';
            
            return `
                <td class="day-cell ${state} ${isTodayClass}" 
                    data-habit-id="${habit.id}" 
                    data-date="${dateStr}"
                    onclick="toggleCell('${habit.id}', '${dateStr}')">
                    ${STATE_SYMBOLS[state]}
                </td>
            `;
        }).join('');
        
        return `
            <tr class="habit-row">
                <td>
                    <div class="habit-name">
                        <span class="habit-type-icon ${typeClass}">${typeIcon}</span>
                        <span class="habit-name-text">${habit.name}</span>
                        <span class="habit-category">${habit.category}</span>
                        <button class="delete-habit" onclick="deleteHabit('${habit.id}')">Delete</button>
                    </div>
                </td>
                ${cells}
                <td class="stats-value streak">🔥 ${streak}</td>
                <td class="stats-value percentage">${percentage}%</td>
            </tr>
        `;
    }).join('');
}

/**
 * Render the monthly heatmap
 */
function renderHeatmap() {
    const container = document.getElementById('heatmapContainer');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    // Calculate completion for each day
    const dailyCompletions = {};
    habits.forEach(habit => {
        Object.keys(habit.entries || {}).forEach(date => {
            if (date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
                dailyCompletions[date] = (dailyCompletions[date] || 0) + 
                    (habit.entries[date] === 'done' ? 1 : 0);
            }
        });
    });
    
    const maxCompletions = Math.max(...Object.values(dailyCompletions), 1);
    
    let html = '<div class="heatmap-month">';
    
    // Add day labels
    const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    dayLabels.forEach(label => {
        html += label ? `<div class="heatmap-label">${label}</div>` : '<div class="heatmap-label"></div>';
    });
    
    // Add empty cells for days before the first of the month
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    for (let i = 0; i < adjustedStartDay; i++) {
        html += '<div class="heatmap-cell level-0" style="visibility: hidden;"></div>';
    }
    
    // Add cells for each day
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const completions = dailyCompletions[dateStr] || 0;
        
        let level = 0;
        if (completions > 0) {
            level = Math.min(4, Math.ceil((completions / maxCompletions) * 4));
        }
        
        const isTodayClass = isToday(new Date(year, month, day)) ? 'today' : '';
        
        html += `<div class="heatmap-cell level-${level} ${isTodayClass}" 
                      title="${dateStr}: ${completions} completions"
                      onclick="jumpToDate('${dateStr}')"></div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Render weekly statistics
 */
function renderStats() {
    const weekDates = getWeekDates(currentWeekOffset);
    let totalCompleted = 0;
    let totalPossible = 0;
    let bestStreak = 0;
    let longestStreakHabit = '-';
    
    habits.forEach(habit => {
        const streak = calculateStreak(habit);
        if (streak > bestStreak) {
            bestStreak = streak;
            longestStreakHabit = habit.name;
        }
        
        Object.values(habit.entries || {}).forEach(state => {
            totalPossible++;
            if (state === 'done') {
                totalCompleted++;
            }
        });
    });
    
    const successRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    
    document.getElementById('totalCompleted').textContent = totalCompleted;
    document.getElementById('bestStreak').textContent = bestStreak;
    document.getElementById('successRate').textContent = `${successRate}%`;
    document.getElementById('longestStreakHabit').textContent = 
        longestStreakHabit.length > 15 ? longestStreakHabit.substring(0, 15) + '...' : longestStreakHabit;
}

/**
 * Render motivational message
 */
function renderMotivation() {
    const container = document.getElementById('motivationContainer');
    const textEl = document.getElementById('motivationText');
    
    // Find the longest current streak
    let maxStreak = 0;
    habits.forEach(habit => {
        const streak = calculateStreak(habit);
        if (streak > maxStreak) {
            maxStreak = streak;
        }
    });
    
    // Get appropriate message
    let message = "Start building great habits today! 🌟";
    const streakMilestones = Object.keys(MOTIVATION_MESSAGES).map(Number).sort((a, b) => b - a);
    
    for (const milestone of streakMilestones) {
        if (maxStreak >= milestone) {
            message = MOTIVATION_MESSAGES[milestone];
            break;
        }
    }
    
    textEl.textContent = message;
}

/**
 * Main render function
 */
function render() {
    renderWeekDisplay();
    renderDayHeaders();
    renderTable();
    renderHeatmap();
    renderStats();
    renderMotivation();
}

// ==================== User Actions ====================

/**
 * Toggle cell state
 */
function toggleCell(habitId, dateStr) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Save for undo
    undoStack.push({
        type: 'toggle',
        habitId,
        dateStr,
        previousState: habit.entries?.[dateStr] || 'empty'
    });
    
    // Initialize entries if needed
    if (!habit.entries) {
        habit.entries = {};
    }
    
    // Get current state and cycle to next
    const currentState = habit.entries[dateStr] || 'empty';
    const currentIndex = STATES.indexOf(currentState);
    const nextState = STATES[(currentIndex + 1) % STATES.length];
    
    // Set new state (or remove if empty)
    if (nextState === 'empty') {
        delete habit.entries[dateStr];
    } else {
        habit.entries[dateStr] = nextState;
    }
    
    // Save and render
    saveHabits();
    render();
    
    // Show toast
    const habitName = habit.name;
    const stateText = nextState === 'done' ? 'done' : nextState === 'miss' ? 'not done' : 'not decided';
    showToast(`Marked "${habitName}" as ${stateText} for ${dateStr}`);
}

/**
 * Add new habit
 */
function addHabit(name, category, type) {
    const newHabit = {
        id: generateId(),
        name,
        category,
        type,
        entries: {}
    };
    
    habits.push(newHabit);
    saveHabits();
    render();
    showToast(`Added new habit: "${name}"`);
}

/**
 * Delete habit
 */
function deleteHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
        habits = habits.filter(h => h.id !== habitId);
        saveHabits();
        render();
        showToast(`Deleted habit: "${habit.name}"`);
    }
}

/**
 * Jump to a specific date in the heatmap
 */
function jumpToDate(dateStr) {
    const targetDate = new Date(dateStr);
    const today = new Date();
    
    // Calculate week offset
    const currentWeekDates = getWeekDates(0);
    const currentMonday = currentWeekDates[0];
    
    const diffTime = currentMonday - targetDate;
    const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
    
    currentWeekOffset = diffWeeks;
    render();
}

/**
 * Show toast notification
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    const messageEl = document.getElementById('toastMessage');
    
    messageEl.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Undo last action
 */
function undo() {
    if (undoStack.length === 0) return;
    
    const lastAction = undoStack.pop();
    
    if (lastAction.type === 'toggle') {
        const habit = habits.find(h => h.id === lastAction.habitId);
        if (habit) {
            if (lastAction.previousState === 'empty') {
                delete habit.entries[lastAction.dateStr];
            } else {
                habit.entries[lastAction.dateStr] = lastAction.previousState;
            }
            saveHabits();
            render();
        }
    }
    
    document.getElementById('toast').classList.remove('show');
    showToast('Undone!');
}

// ==================== Event Listeners ====================

document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadHabits();
    
    // Initial render
    render();
    
    // Week navigation
    document.getElementById('prevWeek').addEventListener('click', () => {
        currentWeekOffset--;
        render();
    });
    
    document.getElementById('nextWeek').addEventListener('click', () => {
        currentWeekOffset++;
        render();
    });
    
    // View tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            render();
        });
    });
    
    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            render();
        });
    });
    
    // Add habit modal
    const modal = document.getElementById('addHabitModal');
    const addBtn = document.getElementById('addHabitBtn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('addHabitForm');
    
    addBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('habitName').value.trim();
        const category = document.getElementById('habitCategory').value;
        const type = document.querySelector('input[name="habitType"]:checked').value;
        
        if (name) {
            addHabit(name, category, type);
            form.reset();
            modal.classList.remove('active');
        }
    });
    
    // Toast undo button
    document.getElementById('toastUndo').addEventListener('click', () => {
        undo();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape to close modal
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
    });
});

// Make functions globally available
window.toggleCell = toggleCell;
window.deleteHabit = deleteHabit;
window.jumpToDate = jumpToDate;
window.undo = undo;

