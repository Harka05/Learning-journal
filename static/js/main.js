document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // SERVICE WORKER
  // ==========================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/static/sw.js')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.log('SW registration failed:', err));
    });
  }

  // ==========================
  // NAVBAR
  // ==========================
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

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("nav-active");
  });

  navLinks.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  navItems.forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("nav-active"));
  });

  document.addEventListener("click", () => navLinks.classList.remove("nav-active"));

  // ==========================
  // CAROUSEL SCROLL
  // ==========================
  document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
    const carousel = wrapper.querySelector(".carousel");
    wrapper.querySelector(".left").onclick = () =>
      carousel.scrollBy({ left: -300, behavior: "smooth" });
    wrapper.querySelector(".right").onclick = () =>
      carousel.scrollBy({ left: 300, behavior: "smooth" });
  });

  // ==========================
  // FOOTER
  // ==========================
  document.getElementById("main-footer").innerHTML = `
    <div class="footer-content">
      <span>© ${new Date().getFullYear()} Harka</span>
      <span id="live-clock"></span>
      <span id="location-text">📍 Detecting location…</span>
    </div>
  `;

  setInterval(() => {
    const now = new Date();
    document.getElementById("live-clock").textContent =
      now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
      " • " +
      now.toLocaleTimeString("en-GB");
  }, 1000);

  navigator.geolocation?.getCurrentPosition(pos => {
    fetch(`/api/location?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
      .then(r => r.json())
      .then(d => {
        document.getElementById("location-text").textContent =
          `📍 ${d.address.city || d.address.town || ""}, ${d.address.country || ""}`;
      }).catch(err => console.log("Location fetch error:", err));
  });

  // ==========================
  // MODAL
  // ==========================
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.querySelector(".modal-close");

  function openModal(content) {
    modalBody.innerHTML = content;
    modal.classList.remove("hidden");
  }

  closeBtn.onclick = () => modal.classList.add("hidden");
  modal.onclick = e => { if (e.target === modal) modal.classList.add("hidden"); }

  // Universal "View More" handler for all cards
  document.addEventListener("click", e => {
    if (e.target.classList.contains("view-more")) {
      openModal(e.target.dataset.content);
    }
  });

  // ==========================
  // LOAD JOURNAL
  // ==========================
  fetch("/api/journal")
    .then(r => r.json())
    .then(d => {
      const container = document.getElementById("journal-cards");
      if (!container) return;

      d.weeks.forEach(w => {
        const card = document.createElement("div");
        card.classList.add("card");

        const h3 = document.createElement("h3");
        h3.textContent = w.week;

        const p = document.createElement("p");
        p.textContent = w.activity;

        const small = document.createElement("small");
        small.textContent = w.notes;

        const btn = document.createElement("button");
        btn.classList.add("view-more", "btn", "glass");
        btn.textContent = "View More";
        btn.dataset.content = `<h2>${w.week}</h2><p>${w.details}</p>`;

        card.append(h3, p, small, btn);
        container.appendChild(card);
      });
    });

  // ==========================
  // LOAD REFLECTIONS
  // ==========================
  fetch("/api/reflections")
    .then(r => r.json())
    .then(d => {
      const container = document.getElementById("reflection-cards");
      if (!container) return;

      d.forEach(r => {
        const card = document.createElement("div");
        card.classList.add("card");

        const p = document.createElement("p");
        p.textContent = r.text;

        const small = document.createElement("small");
        small.textContent = `${r.name} · ${r.date}`;

        const btn = document.createElement("button");
        btn.classList.add("view-more", "btn", "glass");
        btn.textContent = "View More";
        btn.dataset.content = `<h2>${r.name} · ${r.date}</h2><p>${r.details}</p>`;

        card.append(p, small, btn);
        container.appendChild(card);
      });
    });

  // ==========================
  // LOAD PROJECTS
  // ==========================
  async function loadProjects() {
    const container = document.getElementById("projects-carousel");
    if (!container) return;
    container.innerHTML = "";

    try {
      const res = await fetch("/api/projects");
      const projects = await res.json();

      projects.forEach(project => {
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = project.image;
        img.alt = project.title;

        const h3 = document.createElement("h3");
        h3.textContent = project.title;

        const p = document.createElement("p");
        p.textContent = project.description;

        const btn = document.createElement("button");
        btn.className = "btn glass view-more";
        btn.textContent = "View More";
        btn.dataset.content = `
          <h2>${project.title}</h2>
          <img src="${project.image}" alt="${project.title}" style="max-width:100%; border-radius:12px; margin-bottom:1rem;">
          `;
        if(project.title == 'Zen Snake'){
          btn.dataset.content += `<button class="btn glass"><a href="/snake" style="text-decoration: none;color: var(--text);">Play</a></button>`;
        }


          btn.dataset.content +=`<p>${project.details || project.description}</p>
        `;

        card.append(img, h3, p, btn);
        container.appendChild(card);
      });
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  }

  loadProjects();

  // ==========================
  // THEME TOGGLE
  // ==========================
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    updateToggleText(savedTheme);
  } else {
    document.body.classList.add("dark-theme");
  }

  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.replace("dark-theme", "light-theme");
      localStorage.setItem("theme", "light-theme");
      updateToggleText("light-theme");
    } else {
      document.body.classList.replace("light-theme", "dark-theme");
      localStorage.setItem("theme", "dark-theme");
      updateToggleText("dark-theme");
    }
  });

  function updateToggleText(theme) {
    if (theme === "dark-theme") {
      themeToggle.innerHTML = `<i class="fa fa-moon"></i> Dark Mode`;
    } else {
      themeToggle.innerHTML = `<i class="fa fa-sun"></i> Light Mode`;
    }
  }

});
