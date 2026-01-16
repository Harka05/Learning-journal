document.addEventListener("DOMContentLoaded", () => {
document.getElementById("main-header-about").innerHTML = `
    <nav class="glass-nav">
      <ul class="nav-links">
        <li><a href="/"><i class="fa fa-house"></i><span>Home</span></a></li>
        <li><a href="/about"><i class="fa fa-user"></i><span>About</span></a></li>
        
        <li><a href="/snake"><i class="fa fa-gamepad"></i><span>Game</span></a></li>

        <li>
          <a href="javascript:void(0)" id="theme-toggle">
            <i class="fa fa-palette"></i><span>Theme</span>
          </a>
        </li>


      </ul>
      <div class="burger">
        <span></span><span></span><span></span>
      </div>
    </nav>
  `;




let aboutData = null;

fetch("/api/about")
  .then(res => res.json())
  .then(data => {
    aboutData = data;

    // Basic Info
    document.getElementById("about-name").textContent = data.name;
    document.getElementById("about-title").textContent = data.title;
    document.getElementById("about-summary").textContent = data.summary;
    document.getElementById("about-location").textContent = data.personal.location;
    document.getElementById("about-email").textContent = data.personal.email;

    // Skills
    const skillsDiv = document.getElementById("skills");
    data.skills.forEach(skill => {
      skillsDiv.innerHTML += `<div class="skill-group"><li>${skill}</li></div>`;
    });

    // Experience
    const expDiv = document.getElementById("experience");
    data.experience.forEach(exp => {
      expDiv.innerHTML += `
        <div class="card">
          <h3>${exp.role}</h3>
          <strong>${exp.company}</strong>
          <p>${exp.details}</p>
        </div>`;
    });

    // Education
    const eduDiv = document.getElementById("education");
    data.education.forEach(edu => {
      eduDiv.innerHTML += `
        <div class="card">
          <h3>${edu.course}</h3>
          <strong>${edu.institution}</strong>
          <small>${edu.year}</small>
        </div>`;
    });

    // CV Download
    document.getElementById("download-cv").addEventListener("click", e => {
      e.preventDefault();
      if (!aboutData) return;

      const win = window.open("", "_blank");
      win.document.write(`
        <html>
        <head>
          <title>${aboutData.name} - CV</title>
          <style>
            body { font-family: Arial; padding: 40px; }
            h1 { margin-bottom: 0; }
            h2 { margin-top: 30px; }
            p, li { line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>${aboutData.name}</h1>          
          <p>${aboutData.title} <b>|| </b>${aboutData.personal.email}</p> 
          <p>${aboutData.summary}</p>
          

          <h2>Skills</h2>
          <ul>
            ${aboutData.skills.map(s => `<li>${s}</li>`).join("")}
          </ul>

          <h2>Education</h2>
          ${aboutData.education.map(e =>
            `<p>${e.course} — ${e.institution} (${e.year})</p>`).join("")}

          <h2>Experience</h2>
          ${aboutData.experience.map(e =>
            `<p>${e.role} — ${e.company}<br>${e.details}</p>`).join("")}
        </body>
        </html>
      `);
      win.document.close();
      win.print();
    });
  });





  
const themeToggle = document.getElementById("theme-toggle");

// Check saved preference
const savedTheme = localStorage.getItem("theme");
if(savedTheme) {
  document.body.classList.add(savedTheme);
  updateToggleText(savedTheme);
} else {
  document.body.classList.add("dark-theme"); // default
}

// Toggle on click
themeToggle.addEventListener("click", () => {
  if (document.body.classList.contains("dark-theme")) {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    localStorage.setItem("theme", "light-theme");
    updateToggleText("light-theme");
  } else {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark-theme");
    updateToggleText("dark-theme");
  }
});

// Update button icon and text
function updateToggleText(theme) {
  const icon = themeToggle.querySelector("i");
  if(theme === "dark-theme") {
    icon.className = "fa fa-moon";
    themeToggle.innerHTML = `<i class="fa fa-moon"></i> Dark Mode`;
  } else {
    icon.className = "fa fa-sun";
    themeToggle.innerHTML = `<i class="fa fa-sun"></i> Light Mode`;
  }
}



  });