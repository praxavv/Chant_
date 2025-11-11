// ======================================================
// 🌌 Alien Chant Counter - Clean Structured Version
// ======================================================
// This script controls:
// - UI interactions (settings panel, buttons)
// - Mantra management (add/delete/select/save)
// - Counter logic (increment, decrement, reset, manual set)
// - Background music toggle
// - Star background animation
// ======================================================


// ------------------------------
// 🧱 DOM ELEMENT REFERENCES
// ------------------------------
const counterElement = document.getElementById("counter");
const settingsIcon = document.getElementById("settingsIcon");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const resetButton = document.getElementById("resetButton");
const decrementButton = document.getElementById("decrementButton");
const manualCountInput = document.getElementById("manualCountInput");
const setManualCountButton = document.getElementById("setManualCountButton");

const body = document.body;
const starsContainer = document.getElementById("stars");
const bgMusic = document.getElementById("bgMusic");
const playMusicButton = document.getElementById("playMusicButton");

const mantraSelect = document.getElementById("mantraSelect");
const addMantraButton = document.getElementById("addMantraButton");
const deleteMantraButton = document.getElementById("deleteMantraButton");
const activeMantraName = document.getElementById("activeMantraName");
const addCountButton = document.getElementById("addCountButton");
const subtractCountButton = document.getElementById("subtractCountButton");


// ------------------------------
// ⚙️ STATE + CONSTANTS
// ------------------------------
let isMusicPlaying = false;
let mantras = [];
let activeMantraId = null;

const LOCAL_STORAGE_KEY = "alienMantras";
const APP_VERSION_KEY = "mantraAppVersion";
const CURRENT_VERSION = 2; // increment when structure changes


// ======================================================
// 🎵 MUSIC TOGGLE LOGIC
// ======================================================
playMusicButton.addEventListener("click", () => {
  if (isMusicPlaying) {
    // Pause music
    bgMusic.pause();
    playMusicButton.textContent = "▶ Play Music";
  } else {
    // Attempt to play music (some browsers block autoplay)
    bgMusic.play()
      .then(() => playMusicButton.textContent = "⏸ Pause Music")
      .catch(err => {
        alert("Browser blocked audio playback. Tap again or check settings.");
        console.error(err);
      });
  }
  isMusicPlaying = !isMusicPlaying;
});

// Reset button text when music ends
bgMusic.addEventListener("ended", () => {
  isMusicPlaying = false;
  playMusicButton.textContent = "▶ Play Music";
});


// ======================================================
// 📿 MANTRA MANAGEMENT (LocalStorage)
// ======================================================

// --- Save all mantras to localStorage ---
function saveMantras() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mantras));
}

// --- Load mantras and version control ---
function loadMantras() {
  const savedVersion = localStorage.getItem(APP_VERSION_KEY);
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (savedVersion !== CURRENT_VERSION.toString()) {
    // First run of new version → cleanup defaults, keep user-added only
    mantras = stored ? JSON.parse(stored).filter(m => !m.locked) : [];
    localStorage.setItem(APP_VERSION_KEY, CURRENT_VERSION.toString());
    saveMantras();
  } else {
    mantras = stored ? JSON.parse(stored) : [];
  }

  // Set active mantra if none
  if (!activeMantraId && mantras.length) activeMantraId = mantras[0].id;

  updateMantraDropdown();
  updateUI();
}


// --- Update dropdown list ---
function updateMantraDropdown() {
  mantraSelect.innerHTML = ""; // clear old options

  mantras.forEach((m) => {
    const option = document.createElement("option");
    option.value = m.id;
    option.textContent = (m.id === activeMantraId)
      ? m.name
      : `${m.name} (${m.count})`;

    if (m.id === activeMantraId) option.selected = true;
    mantraSelect.appendChild(option);
  });
}


// --- Change active mantra ---
mantraSelect.addEventListener("change", (e) => {
  activeMantraId = parseInt(e.target.value, 10);
  saveMantras();
  updateUI();
});


// --- Add new mantra ---
addMantraButton.addEventListener("click", () => {
  if (mantras.length >= 20) return alert("You can only have up to 20 mantras.");

  const name = prompt("Enter new mantra name:");
  if (!name) return;

  const newMantra = { id: Date.now(), name, count: 0, locked: false };
  mantras.push(newMantra);
  activeMantraId = newMantra.id;

  saveMantras();
  updateMantraDropdown();
  updateUI();
});


// --- Delete selected mantra ---
deleteMantraButton?.addEventListener("click", () => {
  const selectedId = parseInt(mantraSelect.value, 10);
  const target = mantras.find(m => m.id === selectedId);
  if (!target) return;

  if (target.locked)
    return alert(`"${target.name}" is a default mantra and cannot be deleted.`);

  if (!confirm(`Delete "${target.name}" mantra?`)) return;

  mantras = mantras.filter(m => m.id !== selectedId);
  activeMantraId = mantras[0]?.id || null;

  saveMantras();
  updateMantraDropdown();
  updateUI();
});


// ======================================================
// 🔢 COUNTER OPERATIONS
// ======================================================

// --- Update counter UI with active mantra ---
function updateUI() {
  const active = mantras.find(m => m.id === activeMantraId);

  if (!active) {
    activeMantraName.textContent = "No Mantra";
    counterElement.textContent = "0";
    manualCountInput.value = "";
    return;
  }

  activeMantraName.textContent = active.name;
  counterElement.textContent = active.count.toLocaleString();
  manualCountInput.value = active.count;
  updateMantraDropdown();
}

// --- Increment ---
function incrementCount() {
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;
  active.count++;
  saveMantras();
  updateUI();
}

// --- Decrement ---
function decrementCount() {
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active || active.count <= 0) return;
  active.count--;
  saveMantras();
  updateUI();
}

// --- Reset ---
function resetCount() {
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;
  active.count = 0;
  saveMantras();
  updateUI();
}

// --- Set manually from input ---
function setManualCount() {
  const newCount = parseInt(manualCountInput.value, 10);
  if (isNaN(newCount) || newCount < 0)
    return alert("Enter a valid number for the count!");

  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;

  active.count = newCount;
  saveMantras();
  updateUI();
}


// ======================================================
// 🧭 SETTINGS PANEL + UI INTERACTIONS
// ======================================================
settingsIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  settingsPanel.classList.add("active");
  updateUI();
});

closeSettingsButton.addEventListener("click", () => {
  settingsPanel.classList.remove("active");
});

resetButton.addEventListener("click", () => {
  resetCount();
  settingsPanel.classList.remove("active");
});

decrementButton.addEventListener("click", decrementCount);

setManualCountButton.addEventListener("click", () => {
  setManualCount();
  settingsPanel.classList.remove("active");
});

// ✅ Addition
addCountButton?.addEventListener("click", () => {
  const value = parseInt(manualCountInput.value, 10) || 0;
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;
  active.count += value;
  saveMantras();
  updateUI();
});

// ✅ Subtraction (prevents negative count)
subtractCountButton?.addEventListener("click", () => {
  const value = parseInt(manualCountInput.value, 10) || 0;
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;
  active.count = Math.max(0, active.count - value);
  saveMantras();
  updateUI();
});


// ======================================================
// 👆 BODY CLICK = INCREMENT
// ======================================================
body.addEventListener("click", (e) => {
  const clickedInsidePanel = settingsPanel.contains(e.target);
  const clickedIcon = settingsIcon.contains(e.target);

  // Only increment if clicking outside settings
  if (!clickedInsidePanel && !clickedIcon && !settingsPanel.classList.contains("active")) {
    incrementCount();
  }
});


// ======================================================
// 🌠 STAR BACKGROUND ANIMATION
// ======================================================
function createStars(numStars) {
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random()}s`;

    starsContainer.appendChild(star);
  }
}


// ======================================================
// 🚀 INITIALIZE APP
// ======================================================
createStars(200);
loadMantras();
