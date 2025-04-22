function saveEntry(entry) {
    let entries = JSON.parse(localStorage.getItem('moodJournalEntries')) || [];
    entries.push(entry);
    localStorage.setItem('moodJournalEntries', JSON.stringify(entries));
}

function getEntriesForDate(date) {
    const entries = JSON.parse(localStorage.getItem('moodJournalEntries')) || [];
    const dateStr = date.toISOString().split('T')[0];
    
    return entries.filter(entry => {
        const entryDateStr = entry.date.split('T')[0];
        return entryDateStr === dateStr;
    });
}

function getAllEntries() {
    return JSON.parse(localStorage.getItem('moodJournalEntries')) || [];
}

function clearEntries() {
    localStorage.removeItem('moodJournalEntries');
}