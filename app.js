document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const currentDateEl = document.getElementById('current-date');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const saveButton = document.getElementById('save-entry');
    const notesInput = document.getElementById('daily-notes');
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    // State
    let selectedMood = null;
    let currentDate = new Date();
    let viewingDate = new Date(); // For calendar navigation
    
    // Initialize
    updateCurrentDate();
    setupMoodButtons();
    setupSaveButton();
    generateCalendar();
    setupCalendarNavigation();
    
    // Functions
    function updateCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = currentDate.toLocaleDateString(undefined, options);
    }
    
    function setupMoodButtons() {
        moodButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove selected class from all buttons
                moodButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Add selected class to clicked button
                this.classList.add('selected');
                selectedMood = this.dataset.mood;
                
                // Change theme based on mood
                document.body.className = '';
                document.body.classList.add(`${selectedMood}-theme`);
            });
        });
    }
    
    function setupSaveButton() {
        saveButton.addEventListener('click', function() {
            if (!selectedMood) {
                alert('Please select a mood first!');
                return;
            }
            
            const entry = {
                date: currentDate.toISOString(),
                mood: selectedMood,
                notes: notesInput.value,
                weather: getCurrentWeather() // This will come from weather.js
            };
            
            saveEntry(entry);
            alert('Entry saved successfully!');
            resetForm();
            generateCalendar();
        });
    }
    
    function resetForm() {
        moodButtons.forEach(btn => btn.classList.remove('selected'));
        notesInput.value = '';
        selectedMood = null;
        document.body.className = '';
    }
    
    function generateCalendar() {
        calendarGrid.innerHTML = '';
        
        const year = viewingDate.getFullYear();
        const month = viewingDate.getMonth();
        
        // Update month display
        currentMonthEl.textContent = viewingDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        
        // Get first day of month and total days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day');
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = day;
            
            const date = new Date(year, month, day);
            const entries = getEntriesForDate(date);
            
            if (entries.length > 0) {
                dayCell.classList.add('has-entry');
                dayCell.style.setProperty('--mood-color', getMoodColor(entries[0].mood));
                
                // Add tooltip with mood and weather
                dayCell.title = `Mood: ${entries[0].mood}\nWeather: ${entries[0].weather}`;
            }
            
            calendarGrid.appendChild(dayCell);
        }
    }
    
    function setupCalendarNavigation() {
        prevMonthBtn.addEventListener('click', function() {
            viewingDate.setMonth(viewingDate.getMonth() - 1);
            generateCalendar();
        });
        
        nextMonthBtn.addEventListener('click', function() {
            viewingDate.setMonth(viewingDate.getMonth() + 1);
            generateCalendar();
        });
    }
    
    function getMoodColor(mood) {
        const colors = {
            happy: '#FFF9C4',
            sad: '#E3F2FD',
            angry: '#FFEBEE',
            calm: '#E8F5E9',
            excited: '#F3E5F5'
        };
        return colors[mood] || '#ffffff';
    }
})