fetch("backend/reflections.json")
    .then(response => response.json())
    .then(data => {
        const journal = document.getElementById("journal-entries");
        journal.innerHTML = ""; // Clear previous content
        data.forEach(entry => {
            const div = document.createElement("div");
            div.classList.add("entry");
            div.innerHTML = `<strong>${entry.date}</strong>: ${entry.reflection}`;
            journal.appendChild(div);
        });
    })
    .catch(error => console.error("Error loading reflections:", error));
