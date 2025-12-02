const journalContainer = document.getElementById("journal-entries");
const counter = document.getElementById("entry-count");

function loadEntries(filteredData = null) {
    const url = '/get_entries';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const entries = filteredData || data;
            journalContainer.innerHTML = "";
            counter.textContent = `Total reflections: ${entries.length}`;
            entries.forEach(entry => {
                const div = document.createElement("div");
                div.classList.add("entry");
                div.innerHTML = `<strong>${entry.date}</strong>: ${entry.reflection}`;
                journalContainer.appendChild(div);
            });
        });
}

// Filter functionality
document.getElementById("filter-btn").addEventListener("click", () => {
    const keyword = document.getElementById("filter-keyword").value.trim();
    if (keyword) {
        fetch(`/filter?keyword=${keyword}`)
            .then(res => res.json())
            .then(data => loadEntries(data));
    } else {
        loadEntries();
    }
});

// Export reflections
document.getElementById("export-btn").addEventListener("click", () => {
    window.location.href = '/export';
});

// Load entries on page load
document.addEventListener("DOMContentLoaded", () => loadEntries());
