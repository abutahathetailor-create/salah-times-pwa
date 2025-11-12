// Complete clean app.js - REPLACE EVERYTHING with this:

// DOM Elements
const currentDateEl = document.getElementById('currentDate');
const hijriDateEl = document.getElementById('hijriDate');
const currentTimeEl = document.getElementById('currentTime');
const countdownTitleEl = document.getElementById('countdownTitle');
const countdownTimerEl = document.getElementById('countdownTimer');
const prayerGridEl = document.getElementById('prayerGrid');
const errorMessageEl = document.getElementById('errorMessage');

// Prayer times data - ONLY ONE DECLARATION
let prayerTimes = {
    Fajr: "04:15 AM",
    Sunrise: "05:35 AM", 
    Dhuhr: "11:55 AM",
    Asr: "03:25 PM",
    Maghrib: "06:15 PM",
    Isha: "07:45 PM"
};

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// Update current time
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    });
    currentTimeEl.textContent = timeString;
    
    if (!currentDateEl.textContent.includes(now.toLocaleDateString())) {
        updateDateInfo(now);
    }
}

function updateDateInfo(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDateEl.textContent = date.toLocaleDateString('en-US', options);
}

// Create prayer-specific elements
function createPrayerSpecificElements() {
    // Fajr elements
    const fajrCard = document.querySelector('.prayer-card[data-prayer="Fajr"]');
    if (fajrCard && !fajrCard.querySelector('.birds-container')) {
        const birdsContainer = document.createElement('div');
        birdsContainer.className = 'birds-container';
        for (let i = 0; i < 5; i++) {
            const bird = document.createElement('div');
            bird.className = 'bird';
            birdsContainer.appendChild(bird);
        }
        
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            starsContainer.appendChild(star);
        }
        
        fajrCard.appendChild(birdsContainer);
        fajrCard.appendChild(starsContainer);
    }

    // Sunrise elements
    const sunriseCard = document.querySelector('.prayer-card[data-prayer="Sunrise"]');
    if (sunriseCard && !sunriseCard.querySelector('.sun-rays')) {
        const sunRays = document.createElement('div');
        sunRays.className = 'sun-rays';
        for (let i = 0; i < 4; i++) {
            const ray = document.createElement('div');
            ray.className = 'ray';
            sunRays.appendChild(ray);
        }
        
        const clouds = document.createElement('div');
        clouds.className = 'clouds';
        for (let i = 0; i < 2; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            clouds.appendChild(cloud);
        }
        
        sunriseCard.appendChild(sunRays);
        sunriseCard.appendChild(clouds);
    }

    // Dhuhr elements
    const dhuhrCard = document.querySelector('.prayer-card[data-prayer="Dhuhr"]');
    if (dhuhrCard && !dhuhrCard.querySelector('.sun-beams')) {
        const sunBeams = document.createElement('div');
        sunBeams.className = 'sun-beams';
        for (let i = 0; i < 4; i++) {
            const beam = document.createElement('div');
            beam.className = 'beam';
            sunBeams.appendChild(beam);
        }
        
        const heatWaves = document.createElement('div');
        heatWaves.className = 'heat-waves';
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'heat-wave';
            heatWaves.appendChild(wave);
        }
        
        dhuhrCard.appendChild(sunBeams);
        dhuhrCard.appendChild(heatWaves);
    }

    // Asr elements
    const asrCard = document.querySelector('.prayer-card[data-prayer="Asr"]');
    if (asrCard && !asrCard.querySelector('.shadow-rays')) {
        const shadowRays = document.createElement('div');
        shadowRays.className = 'shadow-rays';
        for (let i = 0; i < 3; i++) {
            const ray = document.createElement('div');
            ray.className = 'shadow-ray';
            shadowRays.appendChild(ray);
        }
        
        const goldenParticles = document.createElement('div');
        goldenParticles.className = 'golden-particles';
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            goldenParticles.appendChild(particle);
        }
        
        asrCard.appendChild(shadowRays);
        asrCard.appendChild(goldenParticles);
    }

    // Maghrib elements
    const maghribCard = document.querySelector('.prayer-card[data-prayer="Maghrib"]');
    if (maghribCard && !maghribCard.querySelector('.horizon')) {
        const horizon = document.createElement('div');
        horizon.className = 'horizon';
        
        const waterReflection = document.createElement('div');
        waterReflection.className = 'water-reflection';
        
        const twilightStars = document.createElement('div');
        twilightStars.className = 'twilight-stars';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.className = 'twilight-star';
            twilightStars.appendChild(star);
        }
        
        const silhouette = document.createElement('div');
        silhouette.className = 'silhouette';
        
        maghribCard.appendChild(horizon);
        maghribCard.appendChild(waterReflection);
        maghribCard.appendChild(twilightStars);
        maghribCard.appendChild(silhouette);
    }

    // Isha elements
    const ishaCard = document.querySelector('.prayer-card[data-prayer="Isha"]');
    if (ishaCard && !ishaCard.querySelector('.moon')) {
        const moon = document.createElement('div');
        moon.className = 'moon';
        
        const nightStars = document.createElement('div');
        nightStars.className = 'night-stars';
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.className = 'night-star';
            nightStars.appendChild(star);
        }
        
        const shootingStars = document.createElement('div');
        shootingStars.className = 'shooting-stars';
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            shootingStars.appendChild(star);
        }
        
        const constellations = document.createElement('div');
        constellations.className = 'constellations';
        for (let i = 0; i < 4; i++) {
            const star = document.createElement('div');
            star.className = 'constellation';
            constellations.appendChild(star);
        }
        
        ishaCard.appendChild(moon);
        ishaCard.appendChild(nightStars);
        ishaCard.appendChild(shootingStars);
        ishaCard.appendChild(constellations);
    }
}

// Display prayer times
function displayPrayerTimes() {
    const prayerIcons = {
        Fajr: "fas fa-sun",
        Sunrise: "fas fa-sunrise",
        Dhuhr: "fas fa-sun",
        Asr: "fas fa-sun",
        Maghrib: "fas fa-sunset",
        Isha: "fas fa-moon"
    };
    
    prayerGridEl.innerHTML = '';
    
    Object.entries(prayerTimes).forEach(([prayer, time]) => {
        const prayerCard = document.createElement('div');
        prayerCard.className = 'prayer-card';
        prayerCard.id = `prayer-${prayer}`;
        prayerCard.setAttribute('data-prayer', prayer);
        
        prayerCard.innerHTML = `
            <div class="prayer-name">
                <i class="${prayerIcons[prayer]}"></i>
                <span>${prayer}</span>
            </div>
            <div class="prayer-time">${time}</div>
        `;
        
        prayerGridEl.appendChild(prayerCard);
    });
    
    createPrayerSpecificElements();
}

// SIMPLE COUNTDOWN - WORKING VERSION
function updateCountdown() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
    
    // Reset classes
    document.querySelectorAll('.prayer-card').forEach(card => {
        card.classList.remove('active', 'next');
    });
    
    let nextPrayerName = '';
    let nextPrayerTime = null;
    let activePrayerName = '';
    
    // Convert prayer times to seconds since midnight
    const prayerTimesInSeconds = {};
    
    Object.entries(prayerTimes).forEach(([prayer, time]) => {
        const [timePart, period] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        const prayerTotalSeconds = hours * 3600 + minutes * 60;
        prayerTimesInSeconds[prayer] = prayerTotalSeconds;
        
        // Check if this prayer is active
        if (prayerTotalSeconds <= currentTotalSeconds) {
            activePrayerName = prayer;
        }
    });
    
    // Find next prayer
    Object.entries(prayerTimesInSeconds).forEach(([prayer, prayerSeconds]) => {
        if (prayerSeconds > currentTotalSeconds) {
            if (!nextPrayerTime || prayerSeconds < nextPrayerTime) {
                nextPrayerName = prayer;
                nextPrayerTime = prayerSeconds;
            }
        }
    });
    
    // If no next prayer found today, use Fajr tomorrow
    if (!nextPrayerName) {
        nextPrayerName = 'Fajr';
        nextPrayerTime = prayerTimesInSeconds.Fajr + (24 * 3600);
    }
    
    // Update UI
    if (activePrayerName) {
        const activeCard = document.getElementById(`prayer-${activePrayerName}`);
        if (activeCard) activeCard.classList.add('active');
    }
    
    if (nextPrayerName) {
        const nextCard = document.getElementById(`prayer-${nextPrayerName}`);
        if (nextCard) nextCard.classList.add('next');
    }
    
    // Calculate time difference
    let timeDiff = nextPrayerTime - currentTotalSeconds;
    if (timeDiff < 0) timeDiff += 24 * 3600;
    
    const hours = Math.floor(timeDiff / 3600);
    const minutes = Math.floor((timeDiff % 3600) / 60);
    const seconds = timeDiff % 60;
    
    // Update display
    countdownTitleEl.textContent = `Time until ${nextPrayerName}:`;
    countdownTimerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Initialize app
function initApp() {
    console.log('Initializing Salah Times App...');
    
    // Set initial date and Hijri date
    updateDateInfo(new Date());
    hijriDateEl.textContent = '7 Jumada al-Thani 1445 AH';
    
    // Display prayer times
    displayPrayerTimes();
    
    // Start timers
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    console.log('App initialized successfully!');
}

// Start when page loads
window.addEventListener('load', initApp);
