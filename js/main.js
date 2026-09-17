/* MARY MEHAN — shared site logic
   Content is stored in localStorage so the Control page can edit it.
   Falls back to the defaults below on first visit or after a reset. */

const MM_KEY = "mm-site-content";

const MM_DEFAULTS = {
  tagline: "Design · Strategy · Direction",
  statement:
    "Work that holds its shape. Mary Mehan builds identities, interfaces, and stories with an editorial hand and an engineer's patience.",
  email: "hello@marymehan.com",
  projects: [
    {
      name: "Will We See a UFO in Our Lifetime?",
      cat: "Data Analytics",
      year: "2026",
      role: "Research & Analysis",
      tone: "t-dark",
      href: "https://docs.google.com/presentation/d/1fIoBhxzarME9IrqiJumE7O31YF--njdriZYRxvHLkfY/edit",
    },
    { name: "Meridian Rebrand", cat: "Identity", year: "2026", role: "Creative Direction", tone: "t-1" },
    { name: "Atlas Field Guide", cat: "Editorial", year: "2025", role: "Design & Layout", tone: "t-dark" },
    { name: "Norr Commerce", cat: "Digital", year: "2025", role: "UX / UI", tone: "t-2" },
    { name: "Hollow Light", cat: "Photography", year: "2024", role: "Art Direction", tone: "t-3" },
    { name: "Civic Type System", cat: "Identity", year: "2024", role: "Type Design", tone: "t-4" },
    { name: "Paper Weather", cat: "Editorial", year: "2023", role: "Concept & Design", tone: "t-dark" },
  ],
};

function mmLoad() {
  try {
    const raw = localStorage.getItem(MM_KEY);
    if (!raw) return structuredClone(MM_DEFAULTS);
    return Object.assign(structuredClone(MM_DEFAULTS), JSON.parse(raw));
  } catch {
    return structuredClone(MM_DEFAULTS);
  }
}

function mmSave(data) {
  localStorage.setItem(MM_KEY, JSON.stringify(data));
}

function mmReset() {
  localStorage.removeItem(MM_KEY);
}

/* ---------- icons (stroke-based line icons) ---------- */

const MM_ICONS = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.9-9.3-9C1.4 8 3 4.9 6.2 4.9c2 0 3.3 1 4.1 2.4h3.4c.8-1.4 2.1-2.4 4.1-2.4 3.2 0 4.8 3.1 3.5 6.1-1.8 4.1-9.3 9-9.3 9z" transform="scale(0.98)"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><path d="M4 6.5h16M4 12h16M4 17.5h16"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/></svg>',
  person: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.5c1-4 3.8-6 7.2-6s6.2 2 7.2 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.5 2"/></svg>',
};

/* ---------- shared chrome: top bar, bottom nav, overlay menu ----------
   Each page sets <body data-page="home|projects|resume|control">. */

const MM_PAGES = [
  { id: "home", label: "Home", href: "index.html", icon: "home" },
  { id: "projects", label: "Projects", href: "projects.html", icon: "heart" },
  { id: "resume", label: "Resume", href: "resume.html", icon: "person" },
  { id: "control", label: "Control", href: "control.html", icon: "clock" },
];

function buildChrome() {
  const page = document.body.dataset.page || "home";

  // top bar
  const top = document.createElement("header");
  top.className = "topbar";
  top.innerHTML = `
    <div class="left">
      <button class="icon-btn" id="menu-open" aria-label="Menu">${MM_ICONS.menu}</button>
      <a class="brand" href="index.html">mary mehan</a>
    </div>
    <div class="right">
      <a class="icon-btn" href="projects.html" aria-label="Projects">${MM_ICONS.heart}</a>
      <a class="icon-btn" href="projects.html" aria-label="Search">${MM_ICONS.search}</a>
      <a class="icon-btn" id="mail-btn" href="#" aria-label="Contact">${MM_ICONS.bag}</a>
    </div>`;
  document.body.prepend(top);

  // bottom nav: menu button + the four pages
  const nav = document.createElement("nav");
  nav.className = "bottomnav";
  nav.setAttribute("aria-label", "Primary");
  nav.innerHTML =
    MM_PAGES.map(
      (p) =>
        `<a href="${p.href}" class="${p.id === page ? "active" : ""}" aria-label="${p.label}">${MM_ICONS[p.icon]}</a>`
    ).join("");
  document.body.appendChild(nav);

  // overlay menu
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  overlay.innerHTML = `
    <button class="menu-close" aria-label="Close menu">&times;</button>
    <nav>
      ${MM_PAGES.map(
        (p) => `<a href="${p.href}" class="${p.id === page ? "active" : ""}">${p.label}</a>`
      ).join("")}
    </nav>
    <div class="menu-foot">mary mehan — portfolio 2026<br /><span id="menu-email"></span></div>`;
  document.body.appendChild(overlay);

  document.getElementById("menu-open").addEventListener("click", () => overlay.classList.add("open"));
  overlay.querySelector(".menu-close").addEventListener("click", () => overlay.classList.remove("open"));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.classList.remove("open");
  });

  // top bar turns solid once you scroll past the hero-ish zone
  addEventListener("scroll", () => top.classList.toggle("solid", scrollY > 40), { passive: true });
  if (scrollY > 40) top.classList.add("solid");

  // contact icon → mailto (email comes from stored content)
  const data = mmLoad();
  const mail = document.getElementById("mail-btn");
  mail.href = "mailto:" + data.email;
  const menuEmail = document.getElementById("menu-email");
  if (menuEmail) menuEmail.textContent = data.email;
}

/* ---------- project card rendering ---------- */

function projectCard(p, i) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = p.href || "projects.html";
  if (p.href) {
    a.target = "_blank";
    a.rel = "noopener";
  }
  a.innerHTML = `
    <div class="thumb ${p.tone || "t-" + ((i % 4) + 1)}" data-num="${String(i + 1).padStart(2, "0")}"></div>
    <div class="cat">${p.cat}</div>
    <div class="name">${p.name}</div>
    <div class="meta"><span class="tag">${p.year}</span>${p.role}</div>`;
  return a;
}

function renderRow(el, projects) {
  el.innerHTML = "";
  projects.forEach((p, i) => el.appendChild(projectCard(p, i)));
}

/* ---------- hero carousel ---------- */

function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const track = hero.querySelector(".hero-track");
  const slides = hero.querySelectorAll(".hero-slide");
  const barsBox = hero.querySelector(".hero-progress");
  let idx = 0;
  let timer;

  const prev = document.createElement("button");
  prev.className = "hero-arrow prev";
  prev.setAttribute("aria-label", "Previous slide");
  prev.innerHTML = MM_ICONS.back;
  const next = document.createElement("button");
  next.className = "hero-arrow next";
  next.setAttribute("aria-label", "Next slide");
  next.innerHTML = MM_ICONS.back;
  hero.appendChild(prev);
  hero.appendChild(next);
  prev.addEventListener("click", () => go(idx - 1, true));
  next.addEventListener("click", () => go(idx + 1, true));

  addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(idx - 1, true);
    if (e.key === "ArrowRight") go(idx + 1, true);
  });

  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Slide " + (i + 1));
    b.addEventListener("click", () => go(i, true));
    barsBox.appendChild(b);
  });
  const bars = barsBox.querySelectorAll("button");

  function go(i, manual) {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    bars.forEach((d, j) => d.classList.toggle("on", j === idx));
    if (manual) restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(idx + 1), 5000);
  }
  go(0);
  restart();
}

document.addEventListener("DOMContentLoaded", () => {
  buildChrome();
  initHero();
});
