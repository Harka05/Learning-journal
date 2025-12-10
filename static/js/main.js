fetch("/api/reflections")
    .then(response => response.json())
    .then(data => {
        const journal = document.getElementById("journal-entries");
        journal.innerHTML = "";

        data.forEach(entry => {
            const div = document.createElement("div");
            div.classList.add("entry");
            div.innerHTML = `
                <strong>${entry.date}</strong>: ${entry.text} — <em>${entry.name}</em>
            `;
            journal.appendChild(div);
        });
    })
    .catch(error => console.error("Error loading reflections:", error));
