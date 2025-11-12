// ======================================================
// 🌌 Alien Chant Counter - CLEAN & FIXES APPLIED
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
const CURRENT_VERSION = 2;


// ======================================================
// 🎵 MUSIC TOGGLE LOGIC
// ======================================================
playMusicButton.addEventListener("click", (e) => {
  e.stopPropagation(); // Stop click from incrementing counter (if panel is closed)
  
  if (isMusicPlaying) {
    bgMusic.pause();
    playMusicButton.textContent = "▶ Play Music";
  } else {
    bgMusic.play()
      .then(() => playMusicButton.textContent = "⏸ Pause Music")
      .catch(err => {
        alert("Browser blocked audio playback. Tap again or check settings.");
        console.error(err);
      });
  }
  isMusicPlaying = !isMusicPlaying;
});

bgMusic.addEventListener("ended", () => {
  isMusicPlaying = false;
  playMusicButton.textContent = "▶ Play Music";
});


// ======================================================
// 📿 MANTRA MANAGEMENT (LocalStorage)
// ======================================================

function saveMantras() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mantras));
}

function loadMantras() {
  const savedVersion = localStorage.getItem(APP_VERSION_KEY);
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (savedVersion !== CURRENT_VERSION.toString()) {
    mantras = stored ? JSON.parse(stored).filter(m => !m.locked) : [];
    localStorage.setItem(APP_VERSION_KEY, CURRENT_VERSION.toString());
    saveMantras();
  } else {
    mantras = stored ? JSON.parse(stored) : [];
  }

  if (!activeMantraId && mantras.length) activeMantraId = mantras[0].id;

  updateMantraDropdown();
  updateUI();
  
  // Attach all non-counter-related listeners here after loading
  attachMantraListeners();
}


function updateMantraDropdown() {
  mantraSelect.innerHTML = "";
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

function attachMantraListeners() {
    mantraSelect.addEventListener("change", (e) => {
      e.stopPropagation(); // FIX: Stop click from bubbling and incrementing
      activeMantraId = parseInt(e.target.value, 10);
      saveMantras();
      updateUI();
    });

    addMantraButton.addEventListener("click", (e) => {
      e.stopPropagation(); // FIX: Stop click from bubbling and incrementing
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

    deleteMantraButton?.addEventListener("click", (e) => {
      e.stopPropagation(); // FIX: Stop click from bubbling and incrementing
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
}


// ======================================================
// 🔢 COUNTER OPERATIONS
// ======================================================

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

function incrementCount() {
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;
  active.count++;
  saveMantras();
  updateUI();
}

function decrementCount() {
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active || active.count <= 0) return;
  active.count--;
  saveMantras();
  updateUI();
}

function resetCount() {
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;
  active.count = 0;
  saveMantras();
  updateUI();
}

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
  settingsIcon.classList.add("hidden");
  updateUI();
});

closeSettingsButton.addEventListener("click", (e) => {
  e.stopPropagation();
  settingsPanel.classList.remove("active");
  settingsIcon.classList.remove("hidden");
});

resetButton.addEventListener("click", (e) => {
  e.stopPropagation();
  resetCount();
  settingsPanel.classList.remove("active");
  settingsIcon.classList.remove("hidden");
});

decrementButton.addEventListener("click", (e) => {
  e.stopPropagation();
  decrementCount();
});

setManualCountButton.addEventListener("click", (e) => {
  e.stopPropagation();
  setManualCount();
  settingsPanel.classList.remove("active");
  settingsIcon.classList.remove("hidden");
});

addCountButton?.addEventListener("click", (e) => {
  e.stopPropagation();
  const value = parseInt(manualCountInput.value, 10) || 0;
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;
  active.count += value;
  saveMantras();
  updateUI();
});

subtractCountButton?.addEventListener("click", (e) => {
  e.stopPropagation();
  const value = parseInt(manualCountInput.value, 10) || 0;
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;
  active.count = Math.max(0, active.count - value);
  saveMantras();
  updateUI();
});


// ======================================================
// 👆 BODY CLICK = INCREMENT & PANEL DISMISSAL (FIXED)
// ======================================================
body.addEventListener("click", (e) => {
    const panelIsActive = settingsPanel.classList.contains("active");
    const clickedSettingsIcon = e.target.id === 'settingsIcon' || e.target.closest('#settingsIcon');

    if (panelIsActive) {
        // Goal: Close panel if click is on the dark background overlay, NOT the content box.
        // The click must be on the settingsPanel element itself, not a child element within the content.
        if (e.target === settingsPanel) {
            settingsPanel.classList.remove("active");
            settingsIcon.classList.remove("hidden");
        }
    } else if (!clickedSettingsIcon) {
        // Goal: Only increment if the panel is NOT active and the settings icon was NOT clicked.
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
