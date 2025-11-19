document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");
  if (header) {
    header.innerHTML = `
      <nav class="navbar">
        <div class="logo">Harka</div>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="projects.html">Projects</a></li>
          <li><a href="journal.html">Journal</a></li>
          <li><a href="about.html">About</a></li>
        </ul>
      </nav>
      <div class="theme-switch-wrapper">🌞
        <label class="theme-switch" for="theme-toggle">
          <input type="checkbox" id="theme-toggle">
          <span class="slider"></span>
        </label>
        <span class="theme-label">🌙</span>
      </div>
    `;
  }


  
  // Theme switcher functionality
  const toggleInput = document.getElementById('theme-toggle');

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggleInput) toggleInput.checked = true;
  }

  if (toggleInput) {
    toggleInput.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }



  
// const toggleButton = document.getElementById('theme-toggle');
// if (toggleButton) {
//   toggleButton.addEventListener('click', () => {
//     document.body.classList.toggle('dark-mode');


//     if (document.body.classList.contains('dark-mode')) {
//       localStorage.setItem('theme', 'dark');
//     } else {
//       localStorage.setItem('theme', 'light');
//     }
//   });

//   // Apply saved theme on load
//   const savedTheme = localStorage.getItem('theme');
//   if (savedTheme === 'dark') {
//     document.body.classList.add('dark-mode');
//   }
  
// }

const footer = document.getElementById("main-footer");
var html = '';
  if (footer) {

    footer.innerHTML = 
     `<p id="current-date"></p>
    <p>&copy; <span id="year"></span> Harka | Portfolio & Learning Journal | Designed by - Harka Adhikari </p>`;
    }


  const year = new Date().getFullYear();


document.getElementById("year").textContent = year;



const dateField = document.getElementById('current-date');
if (dateField) {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateField.textContent = today.toLocaleDateString('en-GB', options);
}


// === Journal Form Validation & Display ===
const form = document.getElementById('journalForm');
const entryText = document.getElementById('entryText');
const message = document.getElementById('formMessage');

// Create a container to hold new entries dynamically
let entriesContainer;

if (form) {
  entriesContainer = document.createElement('div');
  entriesContainer.classList.add('submitted-entries');
  form.parentNode.appendChild(entriesContainer);

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // stop page refresh

    const text = entryText.value.trim();
    const wordCount = text.split(/\s+/).filter(word => word).length;

    if (wordCount < 10) {
      message.textContent = "Please write at least 10 words before submitting.";
      message.style.color = "red";
    } else {
      message.textContent = "Thank you! Your reflection has been recorded.";
      message.style.color = "green";

      // Create a new entry card dynamically
      const newEntry = document.createElement('div');
      newEntry.classList.add('entry-card');
      newEntry.innerHTML = `
        <p>${text}</p>
        <small>Submitted on: ${new Date().toLocaleString()}</small>
      `;

      entriesContainer.prepend(newEntry); // Add new entry at the top

      entryText.value = ""; // Clear textarea
    }
  });
}





});


