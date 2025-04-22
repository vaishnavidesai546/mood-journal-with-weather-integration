document.addEventListener('DOMContentLoaded', function() {
    const currentDateEl = document.getElementById('current-date');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const saveButton = document.getElementById('save-entry');
    const notesInput = document.getElementById('daily-notes');
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    let selectedMood = null;
    let currentDate = new Date();
    let viewingDate = new Date(); // For calendar navigation
    
    updateCurrentDate();
    setupMoodButtons();
    setupSaveButton();
    generateCalendar();
    setupCalendarNavigation();
    
    function updateCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = currentDate.toLocaleDateString(undefined, options);
    }
    
    function setupMoodButtons() {
        moodButtons.forEach(button => {
            button.addEventListener('click', function() {
                moodButtons.forEach(btn => btn.classList.remove('selected'));
                
                this.classList.add('selected');
                selectedMood = this.dataset.mood;
                
        
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
                weather: getCurrentWeather() 
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
    
        currentMonthEl.textContent = viewingDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day');
            calendarGrid.appendChild(emptyCell);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = day;
            
            const date = new Date(year, month, day);
            const entries = getEntriesForDate(date);
            
            if (entries.length > 0) {
                dayCell.classList.add('has-entry');
                dayCell.style.setProperty('--mood-color', getMoodColor(entries[0].mood));
                
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
function renderMoodChart(period = 'week') {
    const entries = getAllEntries();
    if (entries.length === 0) return;

    const moodCounts = {};
    const moodOrder = ['happy', 'excited', 'calm', 'sad', 'angry'];
    
    entries.forEach(entry => {
        const date = new Date(entry.date);
        let key;
        
        if (period === 'week') {
            const weekNum = getWeekNumber(date);
            key = `${date.getFullYear()}-W${weekNum}`;
        } else {
            key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        }
        
        if (!moodCounts[key]) {
            moodCounts[key] = {
                happy: 0,
                sad: 0,
                angry: 0,
                calm: 0,
                excited: 0,
                total: 0
            };
        }
        
        moodCounts[key][entry.mood]++;
        moodCounts[key].total++;
    });
    
    const labels = Object.keys(moodCounts).sort();
    const datasets = moodOrder.map(mood => {
        return {
            label: mood,
            data: labels.map(label => {
                const total = moodCounts[label].total;
                return total > 0 ? (moodCounts[label][mood] / total) * 100 : 0;
            }),
            backgroundColor: getMoodColor(mood)
    2    };
    });
    

    const ctx = document.getElementById('mood-chart').getContext('2d');
    
    if (window.moodChart) {
        window.moodChart.data.labels = labels;
        window.moodChart.data.datasets = datasets;
        window.moodChart.update();
    } else {
        window.moodChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Percentage'
                        }
                    }
                }
            }
        });
    }
}

function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
document.getElementById('trends-period').addEventListener('change', function() {
    renderMoodChart(this.value);
});
renderMoodChart();
})
