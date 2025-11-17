import React, { useState, useEffect, useRef } from 'react';

const LOCAL_STORAGE_KEY = "alienMantras";
const APP_VERSION_KEY = "mantraAppVersion";
const CURRENT_VERSION = 2;

const Stars = () => {
    useEffect(() => {
        const starsContainer = document.getElementById("stars");
        if (!starsContainer) return;

        const createStars = (numStars) => {
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
    }, []);

    return <div className="stars" id="stars"></div>;
};

const Chant = () => {
    const [counter, setCounter] = useState(0);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [mantras, setMantras] = useState([]);
    const [activeMantraId, setActiveMantraId] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [manualCount, setManualCount] = useState(0);

    const bgMusicRef = useRef(null);

    useEffect(() => {
        loadMantras();
    }, []);

    useEffect(() => {
        const activeMantra = mantras.find(m => m.id === activeMantraId);
        if (activeMantra) {
            setCounter(activeMantra.count);
            setManualCount(activeMantra.count);
        }
    }, [activeMantraId, mantras]);

    const saveMantras = (updatedMantras) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMantras));
    };

    const loadMantras = () => {
        const savedVersion = localStorage.getItem(APP_VERSION_KEY);
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        let loadedMantras = [];

        if (savedVersion !== CURRENT_VERSION.toString()) {
            loadedMantras = stored ? JSON.parse(stored).filter(m => !m.locked) : [];
            localStorage.setItem(APP_VERSION_KEY, CURRENT_VERSION.toString());
            saveMantras(loadedMantras);
        } else {
            loadedMantras = stored ? JSON.parse(stored) : [];
        }

        setMantras(loadedMantras);
        if (!activeMantraId && loadedMantras.length) {
            setActiveMantraId(loadedMantras[0].id);
        }
    };

    const updateMantra = (id, newCount) => {
        const updatedMantras = mantras.map(m =>
            m.id === id ? { ...m, count: newCount } : m
        );
        setMantras(updatedMantras);
        saveMantras(updatedMantras);
    };

    const incrementCount = () => {
        if (isSettingsOpen) return;
        const activeMantra = mantras.find(m => m.id === activeMantraId);
        if (activeMantra) {
            updateMantra(activeMantraId, activeMantra.count + 1);
        }
    };

    const toggleMusic = () => {
        if (isMusicPlaying) {
            bgMusicRef.current.pause();
        } else {
            bgMusicRef.current.play().catch(err => {
                alert("Browser blocked audio playback. Tap again or check settings.");
                console.error(err);
            });
        }
        setIsMusicPlaying(!isMusicPlaying);
    };

    const handleMantraChange = (e) => {
        setActiveMantraId(parseInt(e.target.value, 10));
    };

    const addMantra = () => {
        if (mantras.length >= 20) return alert("You can only have up to 20 mantras.");
        const name = prompt("Enter new mantra name:");
        if (!name) return;

        const newMantra = { id: Date.now(), name, count: 0, locked: false };
        const updatedMantras = [...mantras, newMantra];
        setMantras(updatedMantras);
        setActiveMantraId(newMantra.id);
        saveMantras(updatedMantras);
    };

    const deleteMantra = () => {
        const selectedId = activeMantraId;
        const target = mantras.find(m => m.id === selectedId);
        if (!target) return;

        if (target.locked)
            return alert(`"${target.name}" is a default mantra and cannot be deleted.`);

        if (!confirm(`Delete "${target.name}" mantra?`)) return;

        const updatedMantras = mantras.filter(m => m.id !== selectedId);
        setMantras(updatedMantras);
        setActiveMantraId(updatedMantras[0]?.id || null);
        saveMantras(updatedMantras);
    };

    const setManualCountHandler = () => {
        const newCount = parseInt(manualCount, 10);
        if (isNaN(newCount) || newCount < 0) {
            return alert("Enter a valid number for the count!");
        }
        updateMantra(activeMantraId, newCount);
        setIsSettingsOpen(false);
    };
    
    const resetCount = () => {
        updateMantra(activeMantraId, 0);
        setIsSettingsOpen(false);
    };

    const decrementCount = () => {
        const activeMantra = mantras.find(m => m.id === activeMantraId);
        if (activeMantra && activeMantra.count > 0) {
            updateMantra(activeMantraId, activeMantra.count - 1);
        }
    };

    const addManualValue = () => {
        const value = parseInt(manualCount, 10) || 0;
        const activeMantra = mantras.find(m => m.id === activeMantraId);
        if (activeMantra) {
            updateMantra(activeMantraId, activeMantra.count + value);
        }
    };

    const subtractManualValue = () => {
        const value = parseInt(manualCount, 10) || 0;
        const activeMantra = mantras.find(m => m.id === activeMantraId);
        if (activeMantra) {
            updateMantra(activeMantraId, Math.max(0, activeMantra.count - value));
        }
    };

    const activeMantra = mantras.find(m => m.id === activeMantraId);

    return (
        <>
            {!isSettingsOpen && (
                <div id="settingsIcon" onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(true); }}>⚙</div>
            )}
            <div className="chant-container" onClick={incrementCount}>
                <audio ref={bgMusicRef} src="/bg-music.mp3" loop />
                <Stars />
                <div className="container"></div>

                {isSettingsOpen && (
                    <div id="settingsPanel" className="settings-panel active" onClick={(e) => { if (e.target.id === 'settingsPanel') setIsSettingsOpen(false); }}>
                        <div className="settings-content">
                            <button id="closeSettingsButton" className="close-settings-button" onClick={() => setIsSettingsOpen(false)}>&times;</button>
                            <h1 id="activeMantraName">{activeMantra ? activeMantra.name : "No Mantra"}</h1>
                            <div id="viewScore">
                                CHANT: <span id="counter">{activeMantra ? activeMantra.count.toLocaleString() : "0"}</span>
                            </div>

                            <div className="setting-item mantra-box">
                                <label htmlFor="mantraSelect">MANTRA:</label>
                                <div className="mantra-input">
                                    <select id="mantraSelect" value={activeMantraId || ''} onChange={handleMantraChange}>
                                        {mantras.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.id === activeMantraId ? m.name : `${m.name} (${m.count})`}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="mantra-buttons">
                                        <button id="addMantraButton" onClick={addMantra}>+</button>
                                        <button id="deleteMantraButton" onClick={deleteMantra}>−</button>
                                    </div>
                                </div>
                            </div>

                            <div className="setting-item">
                                <label htmlFor="manualCountInput">SET COUNT:</label>
                                <input type="number" id="manualCountInput" min="0" value={manualCount} onChange={(e) => setManualCount(e.target.value)} />
                                <button id="setManualCountButton" onClick={setManualCountHandler}>SET & START</button>
                            </div>

                            <div className="setting-item">
                                <label>MANUAL OPERATIONS:</label>
                                <div className="button-row">
                                    <button id="addCountButton" onClick={addManualValue}>➕ Add</button>
                                    <button id="subtractCountButton" onClick={subtractManualValue}>➖ Subtract</button>
                                </div>
                            </div>

                            <div className="panel-buttons">
                                <button id="decrementButton" onClick={decrementCount}>Decrement</button>
                                <button id="resetButton" onClick={resetCount}>Reset</button>
                                <button id="playMusicButton" onClick={toggleMusic}>
                                    {isMusicPlaying ? "⏸ Pause Music" : "▶ Play Music"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Chant;
