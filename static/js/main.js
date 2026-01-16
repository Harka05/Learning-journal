document.addEventListener("DOMContentLoaded", () => {

  /* NAVBAR */
  document.getElementById("main-header").innerHTML = `
    <nav class="glass-nav">
      <ul class="nav-links">
        <li><a href="/"><i class="fa fa-house"></i><span>Home</span></a></li>
        <li><a href="/about"><i class="fa fa-user"></i><span>About</span></a></li>
        <li><a href="#projects"><i class="fa fa-diagram-project"></i><span>Projects</span></a></li>
        <li><a href="#journal"><i class="fa fa-book"></i><span>Journal</span></a></li>
        <li><a href="#reflections"><i class="fa fa-pen"></i><span>Reflections</span></a></li>
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

  const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

// Toggle menu
burger.addEventListener("click", (e) => {
  e.stopPropagation();
  navLinks.classList.toggle("nav-active");
});

// Prevent close when clicking inside menu
navLinks.addEventListener("click", (e) => {
  e.stopPropagation();
});

// ✅ Auto-close AFTER clicking a nav link
navItems.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("nav-active");
  });
});

// Close when clicking outside
document.addEventListener("click", () => {
  navLinks.classList.remove("nav-active");
});

document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
  const carousel = wrapper.querySelector(".carousel");
  wrapper.querySelector(".left").onclick = () =>
    carousel.scrollBy({ left: -300, behavior: "smooth" });
  wrapper.querySelector(".right").onclick = () =>
    carousel.scrollBy({ left: 300, behavior: "smooth" });
});




  /* FOOTER */
  document.getElementById("main-footer").innerHTML = `
    <div class="footer-content">
      <span>© ${new Date().getFullYear()} Harka</span>
      <span id="live-clock"></span>
      <span id="location-text">📍 Detecting location…</span>
    </div>
  `;

  /* CLOCK */
  setInterval(() => {
    const now = new Date();
    document.getElementById("live-clock").textContent =
      now.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) +
      " • " +
      now.toLocaleTimeString("en-GB");
  }, 1000);

  /* LOCATION */
  navigator.geolocation?.getCurrentPosition(pos => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
      .then(r => r.json())
      .then(d => {
        document.getElementById("location-text").textContent =
          `📍 ${d.address.city || d.address.town || ""}, ${d.address.country || ""}`;
      });
  });

  /* LOAD JOURNAL */
  fetch("/api/journal")
    .then(r => r.json())
    .then(d => {
      const c = document.getElementById("journal-cards");
       if (!c) return;
      d.weeks.forEach(w => {
        c.innerHTML += `
          <div class="card">
            <h3>${w.week}</h3>
            <p>${w.activity}</p>
            <small>${w.notes}</small>
          </div>`;
      });
    });

  /* LOAD REFLECTIONS */
  fetch("/api/reflections")
    .then(r => r.json())
    .then(d => {
      const c = document.getElementById("reflection-cards");
       if (!c) return;
      d.forEach(r => {
        c.innerHTML += `
          <div class="card">
            <p>${r.text}</p>
            <small>${r.name} · ${r.date}</small>
          </div>`;
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
