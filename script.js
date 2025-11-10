const counterElement = document.getElementById("counter");
const settingsIcon = document.getElementById("settingsIcon");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const resetButton = document.getElementById("resetButton");
const decrementButton = document.getElementById("decrementButton");
const body = document.body;
const starsContainer = document.getElementById("stars");
const bgMusic = document.getElementById("bgMusic");
const playMusicButton = document.getElementById("playMusicButton");
const manualCountInput = document.getElementById("manualCountInput");
const setManualCountButton = document.getElementById("setManualCountButton");

// 🕉️ New elements (dropdown)
const mantraSelect = document.getElementById("mantraSelect");
const addMantraButton = document.getElementById("addMantraButton");
const deleteMantraButton = document.getElementById("deleteMantraButton");
const activeMantraName = document.getElementById("activeMantraName");

let isMusicPlaying = false;
let mantras = [];
let activeMantraId = null;

const LOCAL_STORAGE_KEY = "alienMantras";
const APP_VERSION_KEY = "mantraAppVersion";
const CURRENT_VERSION = 2; // Increment when making structural changes

// --- Audio ---
playMusicButton.addEventListener("click", () => {
  if (isMusicPlaying) {
    bgMusic.pause();
    playMusicButton.textContent = "▶ Play Music";
  } else {
    bgMusic.play()
      .then(() => playMusicButton.textContent = "⏸ Pause Music")
      .catch(err => {
        alert("Your browser blocked audio. Tap again or check settings.");
        console.error(err);
      });
  }
  isMusicPlaying = !isMusicPlaying;
});

bgMusic.addEventListener("ended", () => {
  isMusicPlaying = false;
  playMusicButton.textContent = "▶ Play Music";
});

// --- Mantra Logic ---
function saveMantras() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mantras));
}

function loadMantras() {
  const savedVersion = localStorage.getItem(APP_VERSION_KEY);

  if (savedVersion !== CURRENT_VERSION.toString()) {
    // First time running this version
    // Keep only user-added mantras; remove old defaults if any
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const allMantras = JSON.parse(stored);
      mantras = allMantras.filter(m => !m.locked); // remove old defaults
    } else {
      mantras = [];
    }

    localStorage.setItem(APP_VERSION_KEY, CURRENT_VERSION.toString());
    saveMantras();
  } else {
    // Load normally
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    mantras = stored ? JSON.parse(stored) : [];
  }

  // Set active mantra
  if (!activeMantraId && mantras.length) activeMantraId = mantras[0].id;

  updateMantraDropdown();
  updateUI();
}

function updateMantraDropdown() {
  mantraSelect.innerHTML = "";
  mantras.forEach((m) => {
    const option = document.createElement("option");
    option.value = m.id;

    if (m.id === activeMantraId) {
      option.textContent = m.name;
    } else {
      option.textContent = `${m.name} (${m.count})`;
    }

    if (m.id === activeMantraId) option.selected = true;
    mantraSelect.appendChild(option);
  });
}

mantraSelect.addEventListener("change", (e) => {
  activeMantraId = parseInt(e.target.value, 10);
  saveMantras();
  updateUI();
});

// --- Add / Delete ---
addMantraButton.addEventListener("click", () => {
  if (mantras.length >= 20) {
    alert("You can only have up to 20 mantras.");
    return;
  }
  const name = prompt("Enter new mantra name:");
  if (!name) return;
  const newMantra = { id: Date.now(), name, count: 0, locked: false };
  mantras.push(newMantra);
  activeMantraId = newMantra.id;
  saveMantras();
  updateMantraDropdown();
  updateUI();
});

if (deleteMantraButton) {
  deleteMantraButton.addEventListener("click", () => {
    const selectedId = parseInt(mantraSelect.value, 10);
    const m = mantras.find(x => x.id === selectedId);
    if (!m) return;

    if (m.locked) {
      alert(`"${m.name}" is a default mantra and cannot be deleted.`);
      return;
    }

    if (!confirm(`Delete "${m.name}" mantra?`)) return;

    mantras = mantras.filter(x => x.id !== selectedId);

    if (activeMantraId === selectedId && mantras.length) {
      activeMantraId = mantras[0].id;
    } else if (!mantras.length) {
      activeMantraId = null;
    }

    saveMantras();
    updateMantraDropdown();
    updateUI();
  });
}

// --- UI Update ---
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
  if (isNaN(newCount) || newCount < 0) {
    alert("Enter a valid number for the count!");
    return;
  }
  const active = mantras.find(m => m.id === activeMantraId);
  if (!active) return;
  active.count = newCount;
  saveMantras();
  updateUI();
}

// --- UI Events ---
settingsIcon.addEventListener("click", (event) => {
  event.stopPropagation();
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

decrementButton.addEventListener("click", () => decrementCount());
setManualCountButton.addEventListener("click", () => {
  setManualCount();
  settingsPanel.classList.remove("active");
});

// --- Count Increment on Body Click ---
body.addEventListener("click", (event) => {
  const isClickInside = settingsPanel.contains(event.target);
  const isClickOnIcon = settingsIcon.contains(event.target);
  if (!isClickInside && !isClickOnIcon && !settingsPanel.classList.contains("active")) {
    incrementCount();
  }
});

// --- Stars ---
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

createStars(200);
loadMantras();
