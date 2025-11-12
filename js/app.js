// Simple app.js that will work
console.log('Salah Times App Loaded');

// Update current time continuously
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    });
    
    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) {
        currentTimeEl.textContent = timeString;
    }
}

// Start time updates
setInterval(updateTime, 1000);
updateTime();

console.log('App initialized successfully');


// Jubail coordinates
const JUBAIL_LAT = 27.0040;
const JUBAIL_LNG = 49.6460;

// DOM Elements
const currentDateEl = document.getElementById('currentDate');
const hijriDateEl = document.getElementById('hijriDate');
const currentTimeEl = document.getElementById('currentTime');
const countdownTitleEl = document.getElementById('countdownTitle');
const countdownTimerEl = document.getElementById('countdownTimer');
const prayerGridEl = document.getElementById('prayerGrid');
const errorMessageEl = document.getElementById('errorMessage');

// Prayer times data
let prayerTimes = {};
let activePrayer = '';
let nextPrayer = '';
let apiAttempts = 0;
const MAX_API_ATTEMPTS = 2;

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
// Create prayer-specific elements for all prayers
function createPrayerSpecificElements() {
    // Fajr elements (already exists)
    const fajrCard = document.querySelector('.prayer-card[data-prayer="Fajr"]');
    if (fajrCard) {
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
    if (sunriseCard) {
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
    if (dhuhrCard) {
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
    if (asrCard) {
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
if (maghribCard) {
    // Horizon line
    const horizon = document.createElement('div');
    horizon.className = 'horizon';
    
    // Water reflection
    const waterReflection = document.createElement('div');
    waterReflection.className = 'water-reflection';
    
    // Twilight stars
    const twilightStars = document.createElement('div');
    twilightStars.className = 'twilight-stars';
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.className = 'twilight-star';
        twilightStars.appendChild(star);
    }
    
    // Silhouette
    const silhouette = document.createElement('div');
    silhouette.className = 'silhouette';
    
    maghribCard.appendChild(horizon);
    maghribCard.appendChild(waterReflection);
    maghribCard.appendChild(twilightStars);
    maghribCard.appendChild(silhouette);
}

// Isha elements
const ishaCard = document.querySelector('.prayer-card[data-prayer="Isha"]');
if (ishaCard) {
    // Moon
    const moon = document.createElement('div');
    moon.className = 'moon';
    
    // Night stars
    const nightStars = document.createElement('div');
    nightStars.className = 'night-stars';
    for (let i = 0; i < 8; i++) {
        const star = document.createElement('div');
        star.className = 'night-star';
        nightStars.appendChild(star);
    }
    
    // Shooting stars
    const shootingStars = document.createElement('div');
    shootingStars.className = 'shooting-stars';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        shootingStars.appendChild(star);
    }
    
    // Constellations
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
